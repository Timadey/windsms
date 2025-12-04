<?php

namespace App\Services\Sms\Providers;

use App\Interfaces\SmsProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class SmsLive247Provider implements SmsProviderInterface
{
    private string $baseUrl = 'https://api.smslive247.com/api/v4';

    public function __construct(
        private string $apiKey
    ) {}

    public function send(array|string $phoneNumbers, string $message, string $senderId): array
    {
        try {
            $msisdns = is_array($phoneNumbers) ? $phoneNumbers : explode(',', $phoneNumbers);

            // Ensure numbers are in international format without +
            // SMSLive247 might expect specific format, usually 234...
            // Assuming formatPhoneNumber helper handles basic cleaning, but might need adjustment.

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post("{$this->baseUrl}/sms", [
                'senderID' => $senderId,
                'messageText' => $message,
                'mobileNumber' => implode(',', $msisdns),
            ]);

            if ($response->successful()) {
                Log::info('✅ SMS sent successfully (SMSLive247)', ['data' => $response->json()]);
                return ['success' => true, 'data' => $response->json()];
            }

            throw new Exception($response->body());

        } catch (Exception $e) {
            Log::error('❌ Failed to send SMS (SMSLive247)', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function getBalance(): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}/account");

            if ($response->successful()) {
                return ['success' => true, 'data' => $response->json()];
            }

            throw new Exception($response->body());
        } catch (Exception $e) {
            Log::error('❌ Failed to get balance (SMSLive247)', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
