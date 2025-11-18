<?php

namespace App\Shared\Enums;

enum FeaturesEnum: string
{
    case sms = 'sms-units';
    case mixer = 'ai-mixer';
    case api = 'api-access';
    case contacts = 'contacts-upload';
    case sender = 'sender-id';
    case tags = 'tags';

    /**
     * Get all values of the enum as an array.
     *
     * @return array
     */
    public static function values(): array
    {
        return array_map(fn(self $case) => $case->value, self::cases());
    }

    /**
     * Get all names of the enum as an array.
     *
     * @return array
     */
    public static function names(): array
    {
        return array_map(fn(self $case) => $case->name, self::cases());
    }
}
