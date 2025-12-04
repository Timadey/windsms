<?php

namespace App\Services;

use App\Models\SenderId;
use App\Models\User;
use App\Shared\Enums\FeaturesEnum;

class SenderIdService
{
    /**
     * Create a sender ID application
     */
    public function createSenderIdApplication(array $data, User $user): SenderId
    {
        if ($user->cantConsume(FeaturesEnum::sender->value, 1)) {
            throw new \Exception('You do not have enough credits to add a sender ID.');
        }

        $user->consume(FeaturesEnum::sender->value, 1);

        return SenderId::create([
            'user_id' => $user->id,
            'sender_id' => $data['sender_id'],
            'purpose' => $data['purpose'],
            'status' => 'pending',
        ]);
    }

    /**
     * Delete a sender ID
     */
    public function deleteSenderId(SenderId $senderId): void
    {
        if ($senderId->status === 'approved') {
            throw new \Exception('Cannot delete approved sender IDs. Please contact support.');
        }

        $senderId->delete();
    }

    /**
     * Approve a sender ID
     */
    public function approveSenderId(SenderId $senderId): SenderId
    {
        $senderId->approve();
        return $senderId;
    }

    /**
     * Reject a sender ID
     */
    public function rejectSenderId(SenderId $senderId, string $reason): SenderId
    {
        $senderId->reject($reason);
        return $senderId;
    }
}
