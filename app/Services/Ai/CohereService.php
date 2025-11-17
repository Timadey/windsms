<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use Illuminate\Support\Facades\Log;
use Exception;

class CohereService implements AiProviderInterface
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('ai.providers.cohere.base_url');
        $this->apiKey = config('ai.providers.cohere.api_key');
    }

    /**
     * Core cURL request handler
     */
    private function makeRequest(string $endpoint, array $payload): array|string
    {
        $url = "{$this->baseUrl}{$endpoint}";
        Log::info("url: {$url}");
        // $url = "https://production.api.cohere.com/v2/chat";
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            // CURLOPT_CONNECTTIMEOUT => 30,
            // CURLOPT_TIMEOUT => 60,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$this->apiKey}",
                "Content-Type: application/json",
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
        ]);

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error) {
            throw new Exception("cURL Error: {$error}");
        }

        if ($status < 200 || $status >= 300) {
            throw new Exception("HTTP {$status}: {$response}");
        }

        return json_decode($response, true);
    }

    /**
     * Chat completion request to Cohere API
     */
    public function chat(array $messages, string $model = 'command-a-03-2025', float $temperature = 0.8): string
    {
        try {
            $payload = [
                'model' => $model,
                'messages' => $messages,
                'temperature' => $temperature,
                'max_tokens' => 400,
            ];

            $data = $this->makeRequest('/chat', $payload);

            Log::info('✅ Cohere chat response', ['response' => $data]);

            return trim($data['message']['content'][0]['text'] ?? '');
        } catch (Exception $e) {
            Log::error('❌ Cohere /chat API Error', ['error' => $e->getMessage()]);
            return '';
        }
    }

    /**
     * Generate spintax message
     */
    public function generateSpintax(string $message): string
    {
        try {
            $messages = [
                [
                    'role' => 'system',
                    'content' => 'You are a spintax generator.
                    Convert the user\'s message into spintax format using {option1|option2|option3}.
                    Generate at least 10 variations per key words and phrase while keeping meaning intact.
                    Return only the spintax text, no explanations.'
                ],
                [
                    'role' => 'user',
                    'content' => "Convert this message to spintax format:\n\n{$message}"
                ]
            ];

            return $this->chat($messages);
        } catch (Exception $e) {
            Log::error('❌ Cohere Spintax Generation Failed', ['error' => $e->getMessage()]);
            return $message;
        }
    }

    /**
     * Simple connectivity test
     */
    public function test(): bool
    {
        try {
            $messages = [
                [
                    'role' => 'user',
                    'content' => 'Say OK'
                ]
            ];

            $response = $this->chat($messages);
            return $response ?: 'No response from Cohere.';
        } catch (Exception $e) {
            Log::error('❌ Cohere /test Exception', ['error' => $e->getMessage()]);
            return 'Error: ' . $e->getMessage();
        }
    }
}
