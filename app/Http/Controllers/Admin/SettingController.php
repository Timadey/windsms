<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    //TODO: settings should be cached for performance and encrypted where necessary
    public function __construct(
        private readonly SettingsService $settingsService
    ) {}

    public function index()
    {
        return Inertia::render('admin/Settings/Index', [
            'settings' => $this->settingsService->all(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.group' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            $this->settingsService->set(
                $setting['key'],
                $setting['value'],
                'string', // Defaulting to string for now, can be enhanced
                $setting['group'] ?? 'general'
            );
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
