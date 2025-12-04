<?php

namespace App\Interfaces;

interface SmsProviderInterface
{
    /**
     * Send SMS to one or multiple recipients
     *
     * @param array|string $phoneNumbers
     * @param string $message
     * @param string $senderId
     * @return array
     */
    public function send(array|string $phoneNumbers, string $message, string $senderId): array;

    /**
     * Get SMS balance
     *
     * @return array
     */
    public function getBalance(): array;
}
