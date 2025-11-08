<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Models\CampaignLog;
use App\Models\Subscriber;
use App\Services\Sms\SmsService;
use App\Services\SpintaxService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SendCampaignSms implements ShouldQueue
{
    use Queueable;

    public Campaign $campaign;
    // public int $tries = 3; // Number of times the job may be attempted
    // public int $timeout = 300; // 5 minutes timeout

    /**
     * Create a new job instance.
     */
    public function __construct(Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Execute the job.
     * @param SpintaxService $spintaxService
     * @param SmsService $smsService
     * @throws \Throwable
     */
    public function handle(SpintaxService $spintaxService, SmsService $smsService): void
    {
        // Update campaign status to processing if it's not already
        if ($this->campaign->status !== 'processing') {
            $this->campaign->update(['status' => 'processing']);
        }

        // Get subscribers who haven't been sent to yet
        $subscribers = $this->getUnsentSubscribers();

        if ($subscribers->isEmpty()) {
            // All subscribers have been processed, mark campaign as completed
            $this->completeCampaign();
            return;
        }

        $sentCount = 0;
        $failedCount = 0;
        $pendingCount = 0;

        foreach ($subscribers as $subscriber) {
            // Check again if this subscriber already has a log entry (double-check for safety)
            $existingLog = CampaignLog::where('campaign_id', $this->campaign->id)
                ->where('subscriber_id', $subscriber->id)
                ->exists();

            if ($existingLog) {
                Log::info("Skipping subscriber {$subscriber->id} - already processed");
                continue;
            }
            // Process spintax to create unique message variation
            $messageVariation = $spintaxService->process($this->campaign->spintax_message);

            // Personalize message with subscriber details if placeholders exist
            $personalizedMessage = $this->personalizeMessage($messageVariation, $subscriber);

            try {
                // Send SMS via MTN Bulk SMS
                $result = $smsService->send(
                    phoneNumbers: [$subscriber->phone_number],
                    message: $personalizedMessage,
                    senderId: $this->campaign->sender_id ?? config('services.mtn_bulksms.default_sender_id', 'Samic Data')
                );

                if ($result && isset($result['success']) && $result['success']) {
                    // Create log entry atomically to prevent duplicates
                    DB::transaction(function () use ($subscriber, $personalizedMessage) {
                        // Double-check inside transaction
                        $exists = CampaignLog::where('campaign_id', $this->campaign->id)
                            ->where('subscriber_id', $subscriber->id)
                            ->lockForUpdate()
                            ->exists();

                        if (!$exists) {
                            CampaignLog::create([
                                'campaign_id' => $this->campaign->id,
                                'subscriber_id' => $subscriber->id,
                                'message_sent' => $personalizedMessage,
                                'status' => 'sent',
                                'sent_at' => now(),
                            ]);
                        }
                    }, 3);

                    $sentCount++;
                }else {
                    throw new \Exception($result['error'] ?? 'SMS sending failed');
                }

                usleep(100000); // 100ms delay
            } catch (\Exception $e) {
                // Determine if it's a network/temporary issue or permanent failure
                $isTemporaryIssue = $this->isTemporaryIssue($e);

                // Log failed attempt (only if no log exists)
                DB::transaction(function () use (&$failedCount, &$pendingCount, $isTemporaryIssue, $subscriber, $personalizedMessage, $e) {
                    $exists = CampaignLog::where('campaign_id', $this->campaign->id)
                        ->where('subscriber_id', $subscriber->id)
                        ->lockForUpdate()
                        ->exists();

                    if (!$exists) {
                        $status = $isTemporaryIssue ? 'pending' : 'failed';

                        CampaignLog::create([
                            'campaign_id' => $this->campaign->id,
                            'subscriber_id' => $subscriber->id,
                            'message_sent' => $personalizedMessage ?? '',
                            'status' => $status,
                            'error_message' => $e->getMessage(),
                            'retry_count' => 0,
                            'next_retry_at' => $isTemporaryIssue ? now()->addMinutes(5) : null,
                        ]);

                        if ($isTemporaryIssue) {
                            $pendingCount++;
                        } else {
                            $failedCount++;
                        }
                    }
                }, 3);

                Log::error("Failed to send SMS to {$subscriber->phone_number}: {$e->getMessage()}");
            }
        }

        // Update campaign counts incrementally
        if ($sentCount > 0) {
            $this->campaign->increment('sent_count', $sentCount);
        }
        if ($failedCount > 0) {
            $this->campaign->increment('failed_count', $failedCount);
        }
        if ($pendingCount > 0) {
            $this->campaign->increment('pending_count', $pendingCount);
        }

        // Check if campaign is complete
        $this->completeCampaign();
    }

    /**
     * Determine if the error is temporary (network/API issue) or permanent
     */
    protected function isTemporaryIssue(\Exception $e): bool
    {
        $message = strtolower($e->getMessage());

        // Network-related issues (temporary)
        $temporaryPatterns = [
            'could not resolve host',
            'connection timed out',
            'connection refused',
            'network or api issue',
            'http 405',
            'http 500',
            'http 502',
            'http 503',
            'http 504',
            'timeout',
            'curl error',
            'unauthorized',
        ];

        foreach ($temporaryPatterns as $pattern) {
            if (str_contains($message, $pattern)) {
                return true;
            }
        }

        // Permanent failures
        $permanentPatterns = [
            'invalid phone number',
            'http 400',
            'http 401',
            'http 403',
            'http 404',
            'forbidden',
        ];

        foreach ($permanentPatterns as $pattern) {
            if (str_contains($message, $pattern)) {
                return false;
            }
        }

        // Default to temporary (better to retry than fail permanently)
        return true;
    }

    /**
     * Get subscribers who haven't received the campaign yet
     */
    protected function getUnsentSubscribers()
    {
        return Subscriber::where('user_id', $this->campaign->user_id)
            ->whereHas('tags', function ($q) {
                $q->whereIn('tags.id', $this->campaign->tag_ids);
            })
            ->whereDoesntHave('campaignLogs', function ($q) {
                $q->where('campaign_id', $this->campaign->id);
            })
            ->distinct()
            ->get();
    }

    /**
     * Complete the campaign if all subscribers have been processed
     */
    /**
     * Complete the campaign if all subscribers have been processed
     */
    protected function completeCampaign(): void
    {
        $totalLogs = CampaignLog::where('campaign_id', $this->campaign->id)->count();
        $pendingLogs = CampaignLog::where('campaign_id', $this->campaign->id)
            ->where('status', 'pending')
            ->count();

        if ($totalLogs >= $this->campaign->total_recipients) {
            // If there are pending messages, keep status as processing
            if ($pendingLogs > 0) {
                $this->campaign->update(['status' => 'processing']);
                Log::info("Campaign {$this->campaign->id} has {$pendingLogs} pending messages for retry");
            } else {
                $this->campaign->update([
                    'status' => 'completed',
                    'completed_at' => now()
                ]);
                Log::info("Campaign {$this->campaign->id} completed. Sent: {$this->campaign->sent_count}, Failed: {$this->campaign->failed_count}");
            }
        } else {
            // Dispatch next batch
            $remainingCount = $this->campaign->total_recipients - $totalLogs;
            if ($remainingCount > 0) {
                Log::info("Campaign {$this->campaign->id} has {$remainingCount} remaining. Dispatching next batch.");
                dispatch(new SendCampaignSms($this->campaign))->delay(now()->addSeconds(5));
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Campaign {$this->campaign->id} job failed: {$exception->getMessage()}");

        // Don't mark as failed if subscribers were partially processed
        // The job can be retried or manually restarted
        $this->campaign->update([
            'status' => 'paused', // Use 'paused' instead of 'failed' to allow restart
        ]);
    }

    /**
    * Personalize message with subscriber details
    */
    protected function personalizeMessage(string $message, Subscriber $subscriber): string
    {
        $replacements = [
            '$name' => $subscriber->name ?? '',
            '$first_name' => $subscriber->first_name ?? $subscriber->name ?? '',
            '$last_name' => $subscriber->last_name ?? '',
            '$phone' => $subscriber->phone_number ?? '',
            '$email' => $subscriber->email ?? '',
        ];

        // Add custom fields if they exist
        if ($subscriber->custom_fields && is_array($subscriber->custom_fields)) {
            foreach ($subscriber->custom_fields as $key => $value) {
                $replacements["{custom_{$key}}"] = $value;
            }
        }

        return str_replace(
            array_keys($replacements),
            array_values($replacements),
            $message
        );
    }
}
