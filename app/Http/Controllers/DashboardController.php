<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'stats' => $this->dashboardService->getStats($user),
            'recentCampaigns' => $this->dashboardService->getRecentCampaigns($user),
            'messageTrends' => $this->dashboardService->getMessageTrends($user),
            'currentSubscription' => $user->subscription?->load('plan'),
            'smsBalance' => $user->balance('sms-units'),
        ]);
    }
}
