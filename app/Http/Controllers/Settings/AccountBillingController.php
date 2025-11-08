<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AccountBillingController extends Controller
{
    public function subscription()
    {
        $user = auth()->user();
        $subscription = $user->subscription;

        $currentSubscription = null;
        if ($subscription) {
            $currentSubscription = [
                'id' => $subscription->id,
                'plan' => $subscription->plan->name,
                'started_at' => $subscription->started_at,
                'expires_at' => $subscription->expires_at,
                'is_active' => !$subscription->expired(),
                'is_suppressed' => $subscription->suppressed,
                'days_remaining' => now()->diffInDays($subscription->expires_at, false),
            ];
        }

        return Inertia::render('settings/account-billing', [
            'user' => $user,
            'currentSubscription' => $currentSubscription,
            'smsBalance' => 0,//$user->getSmsBalance(),
        ]);
    }
}
