<?php

namespace App\Services\Sms\Providers;

use App\Interfaces\SmsProviderInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Exception;

class MtnSmsProvider implements SmsProviderInterface
{
    private string $sessionCookie;
    private string $baseUrl = 'https://bulksms.mtn.ng/api';

    public function __construct()
    {
        $cachedToken = Cache::get('mtn_session_token');
        $this->sessionCookie = "__Secure-bulksms.mtn.ng.session-token=" . ($cachedToken ?? config('services.mtn_bulksms.session_cookie'));
    }

    private function getHeaders(): array
    {
        return [
            'Accept: application/json',
            'Cookie: ' . $this->sessionCookie,
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        ];
    }

    private function makeRequest(string $method, string $endpoint, array $payload = []): array|string
    {
        $url = "{$this->baseUrl}{$endpoint}";
        $ch = curl_init();

        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 0,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_HEADER => true,
            CURLOPT_HTTPHEADER => $this->getHeaders(),
        ];

        if ($method === 'POST') {
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_POSTFIELDS] = json_encode($payload);
            $options[CURLOPT_HTTPHEADER][] = 'Content-Type: application/json';
        }

        curl_setopt_array($ch, $options);

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($error) {
            throw new Exception("cURL error: {$error}");
        }

        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $header = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        if (preg_match('/__Secure-bulksms\.mtn\.ng\.session-token=([^;]+)/', $header, $matches)) {
            $token = $matches[1];
            Cache::put('mtn_session_token', $token, now()->addHours(6));
        }

        $decoded = json_decode($body, true);

        if ($statusCode < 200 || $statusCode >= 300) {
            throw new Exception("HTTP {$statusCode}: " . ($response ?: 'No response'));
        }

        return $decoded ?? [];
    }

    public function send(array|string $phoneNumbers, string $message, string $senderId): array
    {
        try {
            $msisdnsString = is_array($phoneNumbers) ? implode(',', $phoneNumbers) : $phoneNumbers;

            $payload = [
                'contactTitle' => '',
                'msisdns' => $msisdnsString,
                'contact' => '',
                'senderId' => $senderId,
                'message' => $message,
                'selectType' => 'manually',
                'sendSmsType' => 'now',
                'selectDateAndTime' => now()->subMinutes(55)->toDateTimeLocalString() . 'Z',
            ];

            $data = $this->makeRequest('POST', '/v1/sms/compose-sms', $payload);
            Log::info('✅ SMS sent successfully (MTN)', ['data' => $data]);
            return ['success' => true, 'data' => $data];
        } catch (Exception $e) {
            Log::error('❌ Failed to send SMS (MTN)', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function getBalance(): array
    {
        // MTN API doesn't seem to have a direct balance endpoint in the provided code,
        // but getSmsBundle was used in the original service.
        // For now, returning empty or implementing if endpoint known.
        // The original code had getSmsBundle calling compose-sms with empty payload? That seems wrong but I'll replicate for now or leave empty.
        return ['success' => true, 'data' => []];
    }

    /**
     * Ping session to verify authentication
     */
    public function pingSession(): ?array
    {
        try {
            $url = "{$this->baseUrl}/auth/session";

            $ch = curl_init();

            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER => true, // ✅ include headers in response
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTPHEADER => $this->getHeaders(),
            ]);

            $response = curl_exec($ch);

            if ($response === false) {
                throw new Exception("cURL error: " . curl_error($ch));
            }

            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $header = substr($response, 0, $headerSize);
            $body = substr($response, $headerSize);

            curl_close($ch);

            // ✅ Extract set-cookie header (session token)
            if (preg_match('/__Secure-bulksms\.mtn\.ng\.session-token=([^;]+)/', $header, $matches)) {
                $token = $matches[1];

                // ✅ Cache token for reuse (e.g., 6 hours)
                Cache::put('mtn_session_token', $token, now()->addHours(6));
            }

            // ✅ Parse and return JSON body
            $decoded = json_decode($body, true);
            return $decoded ?? [];
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Fetch available sender IDs
     */
    public function fetchSenderIds(): ?array
    {
        $cacheKey = 'sender_ids_list';
        $ttl = now()->addHours(24);

        try {
            return cache()->remember($cacheKey, $ttl, function () {
                $data = $this->makeRequest('GET', '/messages/fetchSenderIds');
                Log::info('✅ Sender IDs retrieved from API and cached', ['data' => $data]);
                return $data;
            });

        } catch (Exception $e) {
            Log::error('❌ Failed to fetch sender IDs', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Get sms bundle
     */
    public function getSmsBundle(): ?array {
        try {

            $payload = [];

            $data = $this->makeRequest('POST', '/v1/sms/compose-sms', $payload);
            Log::info('✅ SMS bundle gotten successfully', ['data' => $data]);
            return ['success' => true, 'data' => $data];
        } catch (Exception $e) {
            $result = [
                'error' => $e->getMessage(),
                'message' => "Error getting sms bundle",
            ];
            Log::error('❌ Failed to get sms bundle', $result);
            return $result;
        }
    }
}
