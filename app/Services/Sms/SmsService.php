<?php

namespace App\Services\Sms;

use App\Interfaces\SmsProviderInterface;
use App\Services\SettingsService;
use App\Services\Sms\Providers\MtnSmsProvider;
use App\Services\Sms\Providers\SmsLive247Provider;
use Exception;

class SmsService
{
    public function __construct(
        private SettingsService $settingsService
    ) {}

    /**
     * Resolve the active SMS provider
     */
    public function resolveProvider(): SmsProviderInterface
    {
        $provider = $this->settingsService->get('sms_provider', 'mtn');

        return match ($provider) {
            'smslive247' => new SmsLive247Provider(
                $this->settingsService->get('smslive247_api_key', '')
            ),
            'mtn' => new MtnSmsProvider(),
            default => new MtnSmsProvider(),
        };
    }

    /**
     * Compose and send SMS (Delegates to active provider)
     */
    public function composeSms(
        string|array $msisdns,
        string $message,
        string $senderId
    ): array {
        return $this->resolveProvider()->send($msisdns, $message, $senderId);
    }

    /**
     * Get SMS balance
     */
    public function getBalance(): array
    {
        return $this->resolveProvider()->getBalance();
    }
}
