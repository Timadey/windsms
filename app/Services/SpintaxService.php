<?php

namespace App\Services;

class SpintaxService
{
    /**
     * Parse a spintax string and return one random variation
     */
    public function process(string $text): string
    {
        while (preg_match('/{([^{}]*)}/', $text, $match)) {
            $options = explode('|', $match[1]);
            $selected = $options[array_rand($options)];
            $text = str_replace($match[0], $selected, $text);
        }

        return $text;
    }

    /**
     * Validate if a string contains valid spintax syntax
     */
    public function validate(string $text): bool
    {
        // Check for balanced braces
        $openBraces = substr_count($text, '{');
        $closeBraces = substr_count($text, '}');

        if ($openBraces !== $closeBraces) {
            return false;
        }

        // Check if there are options inside braces
        if (preg_match_all('/{([^{}]*)}/', $text, $matches)) {
            foreach ($matches[1] as $content) {
                if (!str_contains($content, '|')) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Generate multiple unique variations from spintax
     */
    public function generateVariations(string $text, int $count = 10): array
    {
        $variations = [];
        $attempts = 0;
        $maxAttempts = $count * 10;

        while (count($variations) < $count && $attempts < $maxAttempts) {
            $variation = $this->process($text);
            if (!in_array($variation, $variations)) {
                $variations[] = $variation;
            }
            $attempts++;
        }

        return $variations;
    }
}
