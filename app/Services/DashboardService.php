<?php

namespace App\Services;

use App\Models\CampaignLog;
use App\Models\User;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * Get dashboard statistics
     */
    public function getStats(User $user): array
    {
        $campaigns = $user->campaigns();

        return [
            'total_campaigns' => $campaigns->count(),
            'total_subscribers' => $user->subscribers()->count(),
            'total_sent' => $campaigns->sum('sent_count'),
            'total_failed' => $campaigns->sum('failed_count'),
        ];
    }

    /**
     * Get recent campaigns
     */
    public function getRecentCampaigns(User $user, int $limit = 5): Collection
    {
        return $user->campaigns()
            ->latest()
            ->take($limit)
            ->get(['id', 'name', 'status', 'sent_count', 'failed_count', 'created_at']);
    }

    /**
     * Get message trends for charts
     */
    public function getMessageTrends(User $user): Collection
    {
        return cache()->remember('message_trend_'. $user->id, 600, function () use ($user) {
            return CampaignLog::whereHas('campaign', fn($q) =>
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
