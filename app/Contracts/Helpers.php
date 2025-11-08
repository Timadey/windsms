<?php

/**
 * General Conversions for phone numbers
 */
if (!function_exists('formatPhoneNumber')) {
    /**
     * Formats a phone number into a standardized Nigerian format.
     *
     * This function handles conversion between different Nigerian phone number formats:
     * - Local format starting with '0' (e.g. 08012345678)
     * - International format starting with '234' (e.g. 2348012345678)
     * - International format with plus starting with '+234' (e.g. +2348012345678)
     * - 10-digit format without prefix (e.g. 8012345678)
     *
     * Rules when startWithZero is true (default):
     * - If number starts with '0' and is 11 digits - returns as is
     * - If number starts with '234' and is 13 digits - converts to start with '0'
     * - If number starts with '+234' and is 14 digits - converts to start with '0'
     * - If number is 10 digits - prefixes with '0'
     * - Any other format returns original number
     *
     * Rules when startWithZero is false:
     * - If number doesn't start with '0' and is 10 digits - prefixes with '234'
     * - If number starts with '0' and is 11 digits - converts to start with '234'
     * - If number starts with '234' and is 13 digits - returns as is
     * - If number starts with '+234' and is 14 digits - removes the plus
     * - Any other format returns original number
     *
     * @param string $phoneNumber The phone number to format
     * @param bool $startWithZero Whether to format number to start with '0' (true) or '234' (false)
     * @return string The formatted phone number
     */
    function formatPhoneNumber(string $phoneNumber, bool $startWithZero = true): string
    {
        $phoneNumber = trim($phoneNumber);
        if ($startWithZero) {
            if (str_starts_with($phoneNumber, '0') && strlen($phoneNumber) == 11)
                return $phoneNumber;
            if (str_starts_with($phoneNumber, '234') && strlen($phoneNumber) == 13)
                return '0' . substr($phoneNumber, 3);
            if (str_starts_with($phoneNumber, '+234') && strlen($phoneNumber) == 14)
                return '0' . substr($phoneNumber, 4);
            if (strlen($phoneNumber) == 10)
                return '0' . $phoneNumber;
            return $phoneNumber;
        } else {
            if (!str_starts_with($phoneNumber, '0') && strlen($phoneNumber) == 10)
                return '234' . $phoneNumber;
            if (str_starts_with($phoneNumber, '0') && strlen($phoneNumber) == 11)
                return '234' . substr($phoneNumber, 1);
            if (str_starts_with($phoneNumber, '234') && strlen($phoneNumber) == 13)
                return $phoneNumber;
            if (str_starts_with($phoneNumber, '+234') && strlen($phoneNumber) == 14)
                return substr($phoneNumber, 1);
            return $phoneNumber;
        }
    }
}
