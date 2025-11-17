<?php
namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use Illuminate\Support\Facades\Http;

class GeminiService implements AiProviderInterface
{
    public function generateSpintax(string $message): string
    {
        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => config('ai.providers.gemini.api_key'),
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', [
                'contents' => [[
                    'parts' => [[
                        'text' => "You are a spintax generator.
                    Convert the user\'s message into spintax format using {option1|option2|option3}.
                    Generate at least 10 variations per key phrase while keeping meaning intact.
                    Return only the spintax text, no explanations. Convert this message to spintax format:\n\n{$message}"
                    ]]
                ]]
            ]);

            return $response->json('candidates.0.content.parts.0.text');
        } catch (\Exception $e) {
            \Log::error('Gemini API Error: ' . $e->getMessage());
            return $message;
        }
    }

    public function test(): bool
    {
        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => config('ai.providers.gemini.api_key'),
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', [
                'contents' => [[
                    'parts' => [['text' => 'Say OK']]
                ]]
            ]);

            return str_contains($response->body(), 'OK');
        } catch (\Exception $e) {
            logger('Gemini API Error: ' . $e->getMessage());
            return false;
        }
    }
}

