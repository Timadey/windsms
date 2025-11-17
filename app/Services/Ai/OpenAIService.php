<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use OpenAI\Laravel\Facades\OpenAI;

class OpenAIService implements AiProviderInterface
{
    /**
     * Generate spintax version of a message using OpenAI
     */
    public function generateSpintax(string $message): string
    {
        try {
            $response = OpenAI::chat()->create([
                'model' => config('services.openai.model'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a spintax generator. Convert the user\'s message into spintax format by creating multiple variations for words and phrases. Use {option1|option2|option3} syntax. Generate at least 10 variations for key words and phrases to create diverse message variations. Preserve the core meaning while varying the expression. Return only and only the spintax message format, no extra message or explanation.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Convert this message to spintax format:\n\n{$message}"
                    ]
                ],
                'temperature' => 0.8,
            ]);

            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            // Fallback: Return original message if API fails
            \Log::error('OpenAI API Error: ' . $e->getMessage());
            return $message;
        }
    }

    /**
     * Test connection to OpenAI API
     */
    public function test(): bool
    {
        try {
            $response = OpenAI::chat()->create([
                'model' => config('services.openai.model'),
                'messages' => [
                    ['role' => 'user', 'content' => 'Say "OK"']
                ],
                'max_tokens' => 10,
            ]);

            return !empty($response->choices[0]->message->content);
        } catch (\Exception $e) {
            return false;
        }
    }
}
