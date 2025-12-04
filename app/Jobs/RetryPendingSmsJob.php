<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Models\CampaignLog;
use App\Services\Sms\SmsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class RetryPendingSmsJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;
    public int $timeout = 300;
    public int $maxRetries = 5; // Maximum retry attempts per message

    /**
     * Execute the job - Retry all pending SMS messages
     */
    public function handle(SmsService $smsService): void
    {
        Log::info('Starting retry job for pending SMS messages');

        // Get all pending logs that are due for retry
        $pendingLogs = CampaignLog::where('status', 'pending')
            ->where(function ($query) {
                $query->whereNull('next_retry_at')
                    ->orWhere('next_retry_at', '<=', now());
            })
            ->where('retry_count', '<', $this->maxRetries)
            ->with(['campaign', 'subscriber'])
            ->limit(100) // Process in batches
            ->get();

        if ($pendingLogs->isEmpty()) {
            Log::info('No pending SMS messages to retry');
            return;
        }

        $successCount = 0;
        $stillPendingCount = 0;
        $permanentFailCount = 0;

        foreach ($pendingLogs as $log) {
            try {
                // Skip if campaign is not active
                if (!in_array($log->campaign->status, ['processing', 'scheduled'])) {
                    continue;
                }

                // Attempt to send SMS
                $result = $smsService->composeSms(
                    msisdns: [$log->phone_number],
                    message: $log->message_sent,
                    senderId: $log->campaign->sender_id ?? config('services.mtn_bulksms.default_sender_id', 'Windnotes')
                );

                if ($result && isset($result['success']) && $result['success']) {
                    // Success! Update to sent
                    DB::transaction(function () use ($log, $result) {
                        $log->update([
                            'status' => 'sent',
                            'sent_at' => now(),
                            'error_message' => null,
                        ]);
                    });

                    // Update campaign sent count
                    $log->campaign->decrement('pending_count', 1);
                    $log->campaign->increment('sent_count', 1);

                    $successCount++;
                    Log::info("Retry successful for {$log->phone_number}");
                } else {
                    throw new \Exception($result['error'] ?? 'SMS sending failed');
                }

                usleep(150000); // 150ms delay between retries

            } catch (\Exception $e) {
                // Increment retry count
                $newRetryCount = $log->retry_count + 1;

                // Check if max retries reached
                if ($newRetryCount >= $this->maxRetries) {
                    // Mark as permanent failure
                    DB::transaction(function () use ($log, $e, $newRetryCount) {
                        $log->update([
                            'status' => 'failed',
                            'retry_count' => $newRetryCount,
                            'error_message' => "Max retries reached: " . $e->getMessage(),
                            'next_retry_at' => null,
                        ]);
                    });

                    // Update campaign counts
                    $log->campaign->decrement('pending_count', 1);
                    $log->campaign->increment('failed_count', 1);

                    $permanentFailCount++;
                    Log::error("Max retries reached for {$log->phone_number}");
                } else {
                    // Schedule next retry with exponential backoff
                    $retryDelay = $this->calculateRetryDelay($newRetryCount);

                    DB::transaction(function () use ($log, $e, $newRetryCount, $retryDelay) {
                        $log->update([
                            'retry_count' => $newRetryCount,
                            'next_retry_at' => now()->addMinutes($retryDelay),
                            'error_message' => "Retry #{$newRetryCount}: " . $e->getMessage(),
                        ]);
                    });

                    $stillPendingCount++;
                    Log::warning("Retry #{$newRetryCount} failed for {$log->phone_number}. Next retry in {$retryDelay} minutes");
                }
            }
        }

        Log::info("Retry job completed", [
            'success' => $successCount,
            'still_pending' => $stillPendingCount,
            'permanent_fail' => $permanentFailCount,
        ]);

        // Check if any campaigns can be marked as completed
        $this->checkCampaignCompletion();
    }

    /**
     * Calculate retry delay using exponential backoff
     */
    protected function calculateRetryDelay(int $retryCount): int
    {
        // Exponential backoff: 5, 10, 20, 40, 80 minutes
        return min(5 * pow(2, $retryCount - 1), 80);
    }

    /**
     * Check and update campaign completion status
     */
    protected function checkCampaignCompletion(): void
    {
        // Get campaigns that might be ready for completion
        $campaigns = Campaign::where('status', 'processing')
            ->whereDoesntHave('campaignLogs', function ($query) {
                $query->where('status', 'pending');
            })
            ->get();

        foreach ($campaigns as $campaign) {
            $totalLogs = CampaignLog::where('campaign_id', $campaign->id)->count();

            if ($totalLogs >= $campaign->total_recipients) {
                $campaign->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                    'pending_count' => 0,
                ]);

                Log::info("Campaign {$campaign->id} marked as completed after retries");

                if ($campaign->is_recurring) {
                    $this->scheduleNextRecurrence($campaign);
                }
            }
        }
    }

    protected function scheduleNextRecurrence(Campaign $campaign): void
    {
        // Check if we've passed the end date
        if ($campaign->recurrence_end_date && now()->isAfter($campaign->recurrence_end_date)) {
            Log::info("Campaign {$campaign->id} has reached its end date. Not scheduling next occurrence.");
            return;
        }

        // Calculate next run time
        $nextRunAt = $this->calculateNextRun();

        if (!$nextRunAt) {
            Log::error("Failed to calculate next run time for campaign {$campaign->id}");
            return;
        }

        // Create a new campaign instance for the next occurrence
        $newCampaign = Campaign::create([
            'user_id' => $campaign->user_id,
            'name' => $campaign->name,
            'message' =>$campaign->message,
            'spintax_message' => $campaign->spintax_message,
            'tag_ids' => $campaign->tag_ids,
            'phone_numbers' => $campaign->phone_numbers,
            'recipient_type' => $campaign->recipient_type,
            'dispatch_at' => $nextRunAt,
            'status' => 'scheduled',
            'total_recipients' => $campaign->total_recipients,
            'is_recurring' => true,
            'recurrence_type' => $campaign->recurrence_type,
            'recurrence_interval' => $campaign->recurrence_interval,
            'recurrence_end_date' => $campaign->recurrence_end_date,
            'next_run_at' => $this->calculateNextRun($campaign, $nextRunAt),
        ]);

        // Update current campaign
        $campaign->update([
            'last_run_at' => now(),
            'next_run_at' => $nextRunAt,
        ]);

        Log::info("Scheduled next occurrence of campaign {$campaign->id} as campaign {$newCampaign->id} at {$nextRunAt}");
    }

    /**
     * Calculate next run time for recurring campaign
     */
    protected function calculateNextRun(Campaign $campaign, $baseTime = null)
    {
        $carbon = $baseTime ? \Carbon\Carbon::parse($baseTime) : now();

        switch ($campaign->recurrence_type) {
            case 'daily':
                return $carbon->addDay();
            case 'weekly':
                return $carbon->addWeek();
            case 'monthly':
                return $carbon->addMonth();
            case 'custom':
                return $carbon->addDays($campaign->recurrence_interval ?? 1);
            default:
                return null;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Retry pending SMS job failed: {$exception->getMessage()}", [
            'exception' => $exception,
        ]);
    }
}
