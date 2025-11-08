<?php

namespace App\Http\Controllers;

use App\Models\CampaignLog;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_campaigns' => $user->campaigns()->count(),
                'total_subscribers' => $user->subscribers()->count(),
                'total_sent' => $user->campaigns()->sum('sent_count'),
                'total_failed' => $user->campaigns()->sum('failed_count'),
            ],
            'recentCampaigns' => $user->campaigns()
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'status', 'sent_count', 'failed_count', 'created_at']),
            'messageTrends' => $this->getMessageTrends($user),
            'currentSubscription' => $user->subscription,
        ]);
    }

    private function getMessageTrends($user)
    {
        return CampaignLog::whereHas('campaign', fn($q) => $q->where('user_id', $user->id))
            ->selectRaw('DATE(sent_at) as date, COUNT(*) as sent, SUM(status = "failed") as failed')
            ->whereNotNull('sent_at')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();
    }
}
