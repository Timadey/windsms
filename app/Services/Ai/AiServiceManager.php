<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use App\Services\SpintaxService;
use Illuminate\Support\Facades\App;

class AiServiceManager
{
    protected AiProviderInterface $provider;

    public function __construct(protected SpintaxService $spintaxService)
    {
        $driver = config('ai.default', 'openai');

        $this->provider = match ($driver) {
            'openai' => App::make(OpenAIService::class),
            'cohere' => App::make(CohereService::class),
            'gemini' => App::make(GeminiService::class),
            default => App::make(CohereService::class),
        };
    }

    public function generateSpintax(string $message): string
    {
        return $this->provider->generateSpintax($message);
    }

    public function test(): bool
    {
        return $this->provider->test();
    }

    public function spintaxOverview(string $spintax, int $sampleLimit = 20): array
    {
        return $this->spintaxService->spintaxOverview($spintax, $sampleLimit);
    }
}
