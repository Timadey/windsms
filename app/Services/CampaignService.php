<?php

namespace App\Services;

use App\Jobs\SendCampaignSms;
use App\Models\Campaign;
use App\Models\Subscriber;
use App\Models\User;
use App\Shared\Enums\FeaturesEnum;
use Carbon\Carbon;

class CampaignService
{
    /**
     * Create a new campaign
     */
    public function createCampaign(array $data, User $user): Campaign
    {
        // Count total recipients
        $totalRecipients = $this->countRecipients($data['recipient_type'], $data, $user);

        // Validate recipients count
        if ($totalRecipients === 0) {
            throw new \Exception('Please provide at least one valid recipient.');
        }

        // Calculate required balance
        $totalRequiredBalance = $this->calculateRequiredBalance($totalRecipients, $data['message']);

        // Check subscription
        $subscription = $user->subscription;
        if (!$subscription || $subscription->expired()) {
            throw new \Exception('Subscribe to a plan to start sending campaigns.');
        }

        // Check balance
        if ($user->cantConsume(FeaturesEnum::sms->value, $totalRequiredBalance)) {
            throw new \Exception('You do not have sufficient sms units to run this campaign. Reduce your contact or buy more units');
        }

        // Charge user
        $user->consume(FeaturesEnum::sms->value, $totalRequiredBalance);

        // Get valid dispatch time
        $dispatchTime = $this->getValidDispatchTime($data);

        // Calculate next run for recurring campaigns
        $nextRunAt = null;
        if ($data['is_recurring'] ?? false) {
            $nextRunAt = $this->calculateNextRun(
                $dispatchTime,
                $data['recurrence_type'],
                $data['recurrence_interval'] ?? null
            );
        }

        // Determine status
        $status = $this->determineCampaignStatus($data, $dispatchTime);

        // Create campaign
        $campaign = Campaign::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'message' => $data['message'],
            'sender_id' => $data['sender_id'] ?? 'Windnotes',
            'spintax_message' => $data['spintax_message'] ?? $data['message'],
            'recipient_type' => $data['recipient_type'],
            'tag_ids' => $data['recipient_type'] === 'tags' ? $data['tag_ids'] : null,
            'phone_numbers' => $data['recipient_type'] === 'manual' ? $data['phone_numbers'] : null,
            'dispatch_at' => $dispatchTime,
            'status' => $status,
            'total_recipients' => $totalRecipients,
            'is_recurring' => $data['is_recurring'] ?? false,
            'recurrence_type' => $data['recurrence_type'] ?? null,
            'recurrence_interval' => $data['recurrence_interval'] ?? null,
            'recurrence_end_date' => $data['recurrence_end_date'] ?? null,
            'next_run_at' => $nextRunAt,
        ]);

        // Dispatch immediately if processing
        if ($status === 'processing') {
            SendCampaignSms::dispatch($campaign);
        }

        return $campaign;
    }

    /**
     * Count total recipients based on type
     */
    public function countRecipients(string $type, array $data, User $user): int
    {
        if ($type === 'tags') {
            return Subscriber::where('user_id', $user->id)
                ->whereHas('tags', function ($q) use ($data) {
                    $q->whereIn('tags.id', $data['tag_ids']);
                })
                ->distinct()
                ->count();
        }

        return count($data['phone_numbers'] ?? []);
    }

    /**
     * Calculate required SMS balance
     */
    public function calculateRequiredBalance(int $recipientCount, string $message): int
    {
        return determineNumberOfSms($recipientCount, $message);
    }

    /**
     * Get valid dispatch time enforcing 8am - 8pm WAT hours
     */
    public function getValidDispatchTime(array $data): Carbon
    {
        $timezone = 'Africa/Lagos';

        if ($data['dispatch_now'] ?? false || empty($data['dispatch_at'])) {
            $now = now($timezone);

            if ($this->isWithinAllowedHours($now)) {
                return $now;
            }

            return $this->getNextAllowedTime($now);
        }

        $dispatchAt = Carbon::parse($data['dispatch_at'], $timezone);

        if (!$this->isWithinAllowedHours($dispatchAt)) {
            return $this->getNextAllowedTime($dispatchAt);
        }

        return $dispatchAt;
    }

    /**
     * Check if time is within allowed hours (8am - 8pm WAT)
     */
    private function isWithinAllowedHours(Carbon $time): bool
    {
        $hour = $time->hour;
        return $hour >= 8 && $hour < 20;
    }

    /**
     * Get next allowed time (8:30am)
     */
    private function getNextAllowedTime(Carbon $time): Carbon
    {
        $nextTime = $time->copy();

        if ($nextTime->hour < 8) {
            $nextTime->setTime(8, 30, 0);
        } else {
            $nextTime->addDay()->setTime(8, 30, 0);
        }

        return $nextTime;
    }

    /**
     * Determine campaign status based on dispatch time
     */
    public function determineCampaignStatus(array $data, Carbon $dispatchTime): string
    {
        if (($data['dispatch_now'] ?? false) && $this->isWithinAllowedHours(now('Africa/Lagos'))) {
            return 'processing';
        }

        if ($dispatchTime->isNowOrPast()) {
            if ($this->isWithinAllowedHours($dispatchTime)) {
                return 'processing';
            }
        }

        return 'scheduled';
    }

    /**
     * Calculate next run time based on recurrence type
     */
    public function calculateNextRun(Carbon $baseTime, string $type, ?int $interval): ?Carbon
    {
        return match ($type) {
            'daily' => $baseTime->copy()->addDay(),
            'weekly' => $baseTime->copy()->addWeek(),
            'monthly' => $baseTime->copy()->addMonth(),
            'custom' => $baseTime->copy()->addDays($interval ?? 1),
            default => null,
        };
    }

    /**
     * Get success message for campaign creation
     */
    public function getSuccessMessage(array $data, string $status, Carbon $dispatchTime): string
    {
        $isRecurring = $data['is_recurring'] ?? false;
        $timezone = 'Africa/Lagos';

        $baseMessage = $isRecurring ? 'Recurring campaign created successfully.' : 'Campaign created successfully.';

        if ($status === 'scheduled') {
            $formattedTime = $dispatchTime->timezone($timezone)->format('M j, Y \a\t g:i A');
            $baseMessage .= " Scheduled for dispatch at {$formattedTime} WAT.";
        } elseif ($data['dispatch_now'] ?? false) {
            if (!$this->isWithinAllowedHours(now($timezone))) {
                $formattedTime = $dispatchTime->timezone($timezone)->format('M j, Y \a\t g:i A');
                $baseMessage .= " SMS can only be sent between 8:00 AM - 8:00 PM WAT. Scheduled for {$formattedTime} WAT.";
            }
        }

        return $baseMessage;
    }

    /**
     * Restart a paused or failed campaign
     */
    public function restartCampaign(Campaign $campaign): void
    {
        if (!in_array($campaign->status, ['paused', 'failed'])) {
            throw new \Exception('Only paused or failed campaigns can be restarted.');
        }

        $campaign->update(['status' => 'processing']);
        SendCampaignSms::dispatch($campaign);
    }
}
