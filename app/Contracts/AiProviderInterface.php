<?php

namespace App\Contracts;

interface AiProviderInterface
{
    /**
     * Generate spintax text from a message.
     */
    public function generateSpintax(string $message): string;

    /**
     * Test API connectivity.
     */
    public function test(): bool;
}
