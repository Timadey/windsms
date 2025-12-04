<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    /**
     * Get a setting value
     */
    public function get(string $key, $default = null)
    {
        return Cache::rememberForever("setting_{$key}", function () use ($key, $default) {
            $setting = Setting::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value
     */
    public function set(string $key, $value, string $type = 'string', string $group = 'general'): Setting
    {
        $setting = Setting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
            ]
        );

        Cache::forget("setting_{$key}");

        return $setting;
    }

    /**
     * Get all settings for a group
     */
    public function all(string $group = null)
    {
        $query = Setting::query();

        if ($group) {
            $query->where('group', $group);
        }

        return $query->get()->mapWithKeys(function ($setting) {
            return [$setting->key => $setting->value];
        });
    }
}
