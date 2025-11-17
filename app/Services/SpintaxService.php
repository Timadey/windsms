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
    public function generateVariations(string $text, int $count = 100): array
    {
        $variations = [];
        $attempts = 0;
        $maxAttempts = $count * 10;

        while (count($variations) < $count && $attempts < $maxAttempts) {
            $variation = $this->process($text);
            logger()->info($variation);
            if (!in_array($variation, $variations)) {
                $variations[] = $variation;
            }
            $attempts++;
        }

        return $variations;
    }

    /**
     * Recursively expands a spintax string into all possible variations.
     *
     * @param string $spintax
     * @return array
     */
    public function expandSpintax(string $spintax): array {
        // Regular expression to match the innermost {...} block
        $pattern = '/\{([^{}]*)\}/';

        // If no more braces, return the string itself
        if (!preg_match($pattern, $spintax)) {
            return [$spintax];
        }

        $results = [];

        // Match the first innermost braces
        preg_match($pattern, $spintax, $matches);

        // Split the options inside braces
        $options = explode('|', $matches[1]);

        foreach ($options as $option) {
            // Replace the current {...} with one option
            $newString = preg_replace($pattern, $option, $spintax, 1);

            // Recursively expand the rest
            $expanded = $this->expandSpintax($newString);

            // Merge results
            $results = array_merge($results, $expanded);
        }

        return $results;
    }


    /**
     * Expand spintax and return a random sample with total possible combinations.
     *
     * @param string $spintax
     * @param int $sampleLimit Number of variations to return
     * @return array ['sample' => [...], 'total' => int]
     */
    public function spintaxOverview(string $spintax, int $sampleLimit = 100): array
    {

        // Recursive function to count total variations
        $countVariations = function ($text) use (&$countVariations) {
            if (!preg_match('/\{([^{}]*)\}/', $text, $matches)) {
                return 1;
            }
            $options = explode('|', $matches[1]);
            $total = 0;
            foreach ($options as $option) {
                $newText = preg_replace('/\{([^{}]*)\}/', $option, $text, 1);
                $total += $countVariations($newText);
            }
            return $total;
        };

        // // Recursive function to generate one random variation
        // $generateRandomVariation = function ($text) use (&$generateRandomVariation) {
        //     if (!preg_match('/\{([^{}]*)\}/', $text, $matches)) {
        //         return $text;
        //     }
        //     $options = explode('|', $matches[1]);
        //     $option = $options[array_rand($options)];
        //     $newText = preg_replace('/\{([^{}]*)\}/', $option, $text, 1);
        //     return $generateRandomVariation($newText);
        // };
        //
        // // Generate unique random sample
        // $sample = [];
        // $attempts = 0;
        // $maxAttempts = $sampleLimit * 5; // prevent infinite loop if variations < sampleLimit
        // while (count($sample) < $sampleLimit && $attempts < $maxAttempts) {
        //     $variation = $generateRandomVariation($spintax);
        //     $sample[$variation] = $variation; // use keys to avoid duplicates
        //     $attempts++;
        // }
        //
        // $sample = array_values($sample);
        $total = $countVariations($spintax);
        logger()->info("total: $total");

        return [
            'sample' => $this->generateVariations($spintax, $sampleLimit),
            'total' => $total
        ];
    }
}
