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
        // $user->subscription->load('plan');
        $campaigns = $user->campaigns();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_campaigns' => $campaigns->count(),
                'total_subscribers' => $user->subscribers()->count(),
                'total_sent' => $campaigns->sum('sent_count'),
                'total_failed' => $campaigns->sum('failed_count'),
            ],
            'recentCampaigns' => $campaigns
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'status', 'sent_count', 'failed_count', 'created_at']),
            'messageTrends' => $this->getMessageTrends($user),
            'currentSubscription' => $user->subscription?->load('plan'),
            'smsBalance' => $user->balance('sms-units'),
        ]);
    }

    private function getMessageTrends($user)
    {
        return cache()->remember('message_trend_'. $user->id, 600, function () use ($user) {
            CampaignLog::whereHas('campaign', fn($q) =>
            $q->where('user_id', $user->id)
            )
                ->selectRaw("
                    DATE(sent_at) as date,
                    COUNT(*) as sent,
                    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
                ")
                ->whereNotNull('sent_at')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();
        });
    }
}
