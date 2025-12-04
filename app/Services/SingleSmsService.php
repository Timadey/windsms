<?php

namespace App\Services;

use App\Models\CampaignLog;
use App\Models\Subscriber;
use App\Models\User;
use App\Services\Sms\SmsService;
use App\Shared\Enums\FeaturesEnum;
use Illuminate\Support\Collection;

class SingleSmsService
{
    public function __construct(
        private SmsService $smsService
    ) {}

    /**
     * Send a single SMS
     */
    public function sendSingleSms(array $data, User $user): array
    {
        $senderId = $data['sender_id'] ?? 'Windnotes';
        $message = $data['message'];

        // Calculate units needed
        $unitsNeeded = determineNumberOfSms(1, $message);

        // Check balance
        if ($user->cantConsume(FeaturesEnum::sms->value, $unitsNeeded)) {
            throw new \Exception('Insufficient SMS units.');
        }

        // Resolve phone number and subscriber
        $phoneNumber = null;
        $subscriberId = null;

        if ($data['recipient_type'] === 'subscriber') {
            $subscriber = Subscriber::find($data['subscriber_id']);
            $phoneNumber = $subscriber->phone_number;
            $subscriberId = $subscriber->id;
        } else {
            $phoneNumber = formatPhoneNumber($data['phone_number']);
        }

        // Send SMS
        $response = $this->smsService->composeSms($phoneNumber, $message, $senderId);

        if (isset($response['success']) && $response['success']) {
            $user->consume(FeaturesEnum::sms->value, $unitsNeeded);

            CampaignLog::create([
                'user_id' => $user->id,
                'campaign_id' => null,
                'subscriber_id' => $subscriberId,
                'phone_number' => $phoneNumber,
                'message_sent' => $message,
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return ['success' => true, 'message' => 'SMS sent successfully.'];
        } else {
            logger()->error('Failed to send SMS', ['response' => $response]);

            throw new \Exception('Failed to send SMS, please try again later');
        }
    }

    /**
     * Search subscribers
     */
    public function searchSubscribers(string $query, User $user): Collection
    {
        return Subscriber::where('user_id', $user->id)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('phone_number', 'like', "%{$query}%");
            })
            ->limit(20)
            ->get(['id', 'name', 'phone_number']);
    }
}
