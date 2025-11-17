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

    public function __construct(Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    public function handle(SpintaxService $spintaxService, SmsService $smsService): void
    {
        if ($this->campaign->status !== 'processing') {
            $this->campaign->update(['status' => 'processing']);
        }

        // Get recipients based on campaign type
        $recipients = $this->campaign->recipient_type === 'manual'
            ? $this->getManualRecipients()
            : $this->getTaggedRecipients();

        if (empty($recipients)) {
            $this->completeCampaign();
            return;
        }

        $sentCount = 0;
        $failedCount = 0;
        $pendingCount = 0;

        foreach ($recipients as $recipient) {
            // Check if already processed (prevent duplicates)
            //TODO: PHONE NUMBER SHOULD BE THE SINGLE SOURCE FOR CAMPAIGN LOG, NO NEED OF SUBSCRIBER ID
            $existingLog = CampaignLog::where('campaign_id', $this->campaign->id)
                ->where(function($q) use ($recipient) {
                    if (isset($recipient['subscriber_id'])) {
                        $q->where('subscriber_id', $recipient['subscriber_id']);
                    } else {
                        $q->where('phone_number', $recipient['phone_number']);
                    }
                })
                ->exists();

            if ($existingLog) {
                Log::info("Skipping {$recipient['phone_number']} - already processed");
                continue;
            }

            // Process spintax
            $messageVariation = $spintaxService->process($this->campaign->spintax_message);

            // Personalize if subscriber exists
            $personalizedMessage = isset($recipient['subscriber'])
                ? $this->personalizeMessage($messageVariation, $recipient['subscriber'])
                : $messageVariation;

            try {
                $result = $smsService->send(
                    phoneNumbers: [$recipient['phone_number']],
                    message: $personalizedMessage,
                    senderId: $this->campaign->sender_id ?? config('services.mtn_bulksms.default_sender_id', 'Windsms')
                );

                if ($result && isset($result['success']) && $result['success']) {
                    DB::transaction(function () use ($recipient, $personalizedMessage) {
                        $exists = CampaignLog::where('campaign_id', $this->campaign->id)
                            ->where(function($q) use ($recipient) {
                                if (isset($recipient['subscriber_id'])) {
                                    $q->where('subscriber_id', $recipient['subscriber_id']);
                                } else {
                                    $q->where('phone_number', $recipient['phone_number']);
                                }
                            })
                            ->lockForUpdate()
                            ->exists();

                        if (!$exists) {
                            CampaignLog::create([
                                'campaign_id' => $this->campaign->id,
                                'subscriber_id' => $recipient['subscriber_id'] ?? null,
                                'phone_number' => $recipient['phone_number'],
                                'message_sent' => $personalizedMessage,
                                'status' => 'sent',
                                'sent_at' => now(),
                            ]);
                        }
                    }, 3);

                    $sentCount++;
                } else {
                    throw new \Exception($result['error'] ?? 'SMS sending failed');
                }

                usleep(100000);
            } catch (\Exception $e) {
                $isTemporaryIssue = $this->isTemporaryIssue($e);

                DB::transaction(function () use (&$failedCount, &$pendingCount, $isTemporaryIssue, $recipient, $personalizedMessage, $e) {
                    $exists = CampaignLog::where('campaign_id', $this->campaign->id)
                        ->where(function($q) use ($recipient) {
                            if (isset($recipient['subscriber_id'])) {
                                $q->where('subscriber_id', $recipient['subscriber_id']);
                            } else {
                                $q->where('phone_number', $recipient['phone_number']);
                            }
                        })
                        ->lockForUpdate()
                        ->exists();

                    if (!$exists) {
                        $status = $isTemporaryIssue ? 'pending' : 'failed';

                        CampaignLog::create([
                            'campaign_id' => $this->campaign->id,
                            'subscriber_id' => $recipient['subscriber_id'] ?? null,
                            'phone_number' => $recipient['phone_number'],
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

                Log::error("Failed to send SMS to {$recipient['phone_number']}: {$e->getMessage()}");
            }
        }

        if ($sentCount > 0) {
            $this->campaign->increment('sent_count', $sentCount);
        }
        if ($failedCount > 0) {
            $this->campaign->increment('failed_count', $failedCount);
        }
        if ($pendingCount > 0) {
            $this->campaign->increment('pending_count', $pendingCount);
        }

        $this->completeCampaign();
    }

    /**
     * Get manual recipients (phone numbers entered manually)
     */
    protected function getManualRecipients(): array
    {
        $phoneNumbers = $this->campaign->phone_numbers;

        // Get already processed phone numbers
        $processedNumbers = CampaignLog::where('campaign_id', $this->campaign->id)
            ->pluck('phone_number')
            ->toArray();

        // Filter out already processed numbers
        $unsentNumbers = array_diff($phoneNumbers, $processedNumbers);

        // Format as recipient array
        return array_map(function($phoneNumber) {
            return [
                'phone_number' => $phoneNumber,
                'subscriber_id' => null,
                'subscriber' => null,
            ];
        }, $unsentNumbers);
    }

    /**
     * Get tagged recipients (subscribers from tags)
     */
    protected function getTaggedRecipients(): array
    {
        $subscribers = Subscriber::where('user_id', $this->campaign->user_id)
            ->whereHas('tags', function ($q) {
                $q->whereIn('tags.id', $this->campaign->tag_ids);
            })
            ->whereDoesntHave('campaignLogs', function ($q) {
                $q->where('campaign_id', $this->campaign->id);
            })
            ->distinct()
            ->get();

        return $subscribers->map(function($subscriber) {
            return [
                'phone_number' => $subscriber->phone_number,
                'subscriber_id' => $subscriber->id,
                'subscriber' => $subscriber,
            ];
        })->toArray();
    }

    protected function isTemporaryIssue(\Exception $e): bool
    {
        $message = strtolower($e->getMessage());

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

        return true;
    }

    protected function completeCampaign(): void
    {
        $totalLogs = CampaignLog::where('campaign_id', $this->campaign->id)->count();
        $pendingLogs = CampaignLog::where('campaign_id', $this->campaign->id)
            ->where('status', 'pending')
            ->count();

        if ($totalLogs >= $this->campaign->total_recipients) {
            if ($pendingLogs > 0) {
                $this->campaign->update(['status' => 'processing']);
                Log::info("Campaign {$this->campaign->id} has {$pendingLogs} pending messages for retry");
            } else {
                $this->campaign->update([
                    'status' => 'completed',
                    'completed_at' => now()
                ]);
                Log::info("Campaign {$this->campaign->id} completed. Sent: {$this->campaign->sent_count}, Failed: {$this->campaign->failed_count}");

                if ($this->campaign->is_recurring) {
                    $this->scheduleNextRecurrence();
                }
            }
        } else {
            $remainingCount = $this->campaign->total_recipients - $totalLogs;
            if ($remainingCount > 0) {
                Log::info("Campaign {$this->campaign->id} has {$remainingCount} remaining. Dispatching next batch.");
                dispatch(new SendCampaignSms($this->campaign))->delay(now()->addSeconds(5));
            }
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Campaign {$this->campaign->id} job failed: {$exception->getMessage()}");
        $this->campaign->update(['status' => 'paused']);
    }

    protected function scheduleNextRecurrence(): void
    {
        if ($this->campaign->recurrence_end_date && now()->isAfter($this->campaign->recurrence_end_date)) {
            Log::info("Campaign {$this->campaign->id} has reached its end date.");
            return;
        }

        $nextRunAt = $this->calculateNextRun();

        if (!$nextRunAt) {
            Log::error("Failed to calculate next run time for campaign {$this->campaign->id}");
            return;
        }

        $newCampaign = Campaign::create([
            'user_id' => $this->campaign->user_id,
            'name' => $this->campaign->name,
            'message' => $this->campaign->message,
            'spintax_message' => $this->campaign->spintax_message,
            'recipient_type' => $this->campaign->recipient_type,
            'tag_ids' => $this->campaign->tag_ids,
            'phone_numbers' => $this->campaign->phone_numbers,
            'dispatch_at' => $nextRunAt,
            'status' => 'scheduled',
            'total_recipients' => $this->campaign->total_recipients,
            'is_recurring' => true,
            'recurrence_type' => $this->campaign->recurrence_type,
            'recurrence_interval' => $this->campaign->recurrence_interval,
            'recurrence_end_date' => $this->campaign->recurrence_end_date,
            'next_run_at' => $this->calculateNextRun($nextRunAt),
        ]);

        $this->campaign->update([
            'last_run_at' => now(),
            'next_run_at' => $nextRunAt,
        ]);

        Log::info("Scheduled next occurrence as campaign {$newCampaign->id} at {$nextRunAt}");
    }

    protected function calculateNextRun($baseTime = null)
    {
        $carbon = $baseTime ? \Carbon\Carbon::parse($baseTime) : now();

        return match ($this->campaign->recurrence_type) {
            'daily' => $carbon->addDay(),
            'weekly' => $carbon->addWeek(),
            'monthly' => $carbon->addMonth(),
            'custom' => $carbon->addDays($this->campaign->recurrence_interval ?? 1),
            default => null,
        };
    }

    protected function personalizeMessage(string $message, Subscriber $subscriber): string
    {
        $replacements = [
            '{name}' => $subscriber->name ?? '',
            '{first_name}' => $subscriber->first_name ?? $subscriber->name ?? '',
            '{last_name}' => $subscriber->last_name ?? '',
            '{phone}' => $subscriber->phone_number ?? '',
            '{email}' => $subscriber->email ?? '',
        ];

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
