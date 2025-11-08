<?php

namespace App\Http\Controllers;

// use App\Models\SmsUnit;
// use App\Models\Transaction;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use LucasDotVin\Soulbscription\Models\Plan;
use LucasDotVin\Soulbscription\Models\Subscription;

class BillingController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $subscription = $user->subscription;

        // Get all available plans
        $plans = Plan::with('features')->get()->map(function ($plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'periodicity_type' => $plan->periodicity_type,
                'periodicity' => $plan->periodicity,
                'grace_days' => $plan->grace_days,
                'price' => $this->getPlanPrice($plan->name),
                'is_yearly' => str_contains($plan->name, 'yearly'),
                'features' => $plan->features->map(function ($feature) use ($plan) {
                    return [
                        'name' => $feature->name,
                        'consumable' => $feature->consumable,
                        'charges' => $feature->pivot->charges ?? null,
                    ];
                }),
                'extra_sms_price' => $this->getExtraSmsPrice($plan->name),
            ];
        });

        // Get current subscription details
        $currentSubscription = null;
        $featureUsage = [];

        if ($subscription) {
            $currentSubscription = [
                'id' => $subscription->id,
                'plan' => $subscription->plan->name,
                'started_at' => $subscription->started_at,
                'expires_at' => $subscription->expires_at,
                'grace_days_ended_at' => $subscription->grace_days_ended_at,
                'was_switched' => $subscription->was_switched,
                'is_active' => (bool) $subscription->expired_at,
                'is_suppressed' => (bool) $subscription->suppressed_at,
                'days_remaining' => now()->diffInDays($subscription->expires_at, false),
            ];

            // Get feature usage
            foreach ($subscription->plan->features as $feature) {
                if ($feature->consumable) {
                    $consumption = $user->getCurrentConsumption($feature->name);
                    $remaining = $user->balance($feature->name);
                    $total = $user->getTotalCharges($feature->name);

                    $featureUsage[] = [
                        'name' => $feature->name,
                        'consumed' => $consumption,
                        'remaining' => $remaining,
                        'total' => $total,
                        'percentage' => $total > 0
                            ? round(($consumption / $total) * 100, 2)
                            : 0,
                    ];
                }
            }
        }

        // Get SMS units balance
        $smsBalance = $user->balance('sms-units') ?? 0; //$user->sms_units()->sum('units');

        // Get recent transactions
        // $transactions = Transaction::where('user_id', $user->id)
        //     ->latest()
        //     ->take(10)
        //     ->get();
        // $transactions = [];

        return Inertia::render('billing/index', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'featureUsage' => $featureUsage,
            'smsBalance' => $smsBalance,
            // 'transactions' => $transactions,
            // 'extraSmsPrice' => $this->getExtraSmsPrice($subscription?->plan->name),
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            // 'payment_method' => 'required|in:card,wallet,bank_transfer',
            'extra_sms_units' => 'nullable|integer|min:0',
        ]);

        $user = auth()->user();
        $plan = Plan::findOrFail($request->plan_id);
        $planPrice = $this->getPlanPrice($plan->name);
        $extraUnits = $request->extra_sms_units ?? 0;
        $extraSmsPrice = $this->getExtraSmsPrice($plan->name);
        $extraSmsCost = $extraUnits * $extraSmsPrice;
        $totalAmount = $planPrice + $extraSmsCost;

        // Process payment (integrate with your payment gateway)
        $paymentResult = $this->processPayment($user, $totalAmount, $request->payment_method);

        if (!$paymentResult['success']) {
            return back()->with('error', 'Payment failed. Please try again.');
        }

        // TODO: ask user if they want to suppress or wait till end

        // Cancel existing subscription if any
        if ($user->subscription && !$user->subscription->expired()) {
            $user->switchTo($plan);
        }

        // Create new subscription
        $subscription = $user->subscribeTo($plan);

        // Credit SMS units (plan units + extra units)
        $smsFeature = $plan->features()->where('name', 'sms-units')->first();
        $planSmsUnits = $smsFeature ? $smsFeature->pivot->charges : 0;
        $totalSmsUnits = $planSmsUnits + $extraUnits;

        // Record transaction
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'subscription',
            'amount' => $totalAmount,
            'description' => "Subscription to {$plan->name} plan" . ($extraUnits > 0 ? " + {$extraUnits} extra SMS units" : ""),
            'status' => 'completed',
            'payment_method' => $request->payment_method,
            'reference' => $paymentResult['reference'],
        ]);

        return redirect()->route('billing.index')->with('success', 'Subscription activated successfully!');
    }

    public function buyExtraUnits(Request $request)
    {
        $request->validate([
            'units' => 'required|integer|min:1',
            'payment_method' => 'required|in:card,wallet,bank_transfer',
        ]);

        $user = auth()->user();
        $subscription = $user->subscription;

        // Check if user has active subscription
        if (!$subscription || $subscription->expired()) {
            return back()->with('error', 'You must have an active subscription to purchase extra SMS units.');
        }

        $units = $request->units;
        $pricePerUnit = $this->getExtraSmsPrice($subscription->plan->name);
        $totalAmount = $units * $pricePerUnit;

        // Process payment
        $paymentResult = $this->processPayment($user, $totalAmount, $request->payment_method);

        if (!$paymentResult['success']) {
            return back()->with('error', 'Payment failed. Please try again.');
        }

        // Record transaction
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'extra_sms',
            'amount' => $totalAmount,
            'description' => "Purchase of {$units} extra SMS units",
            'status' => 'completed',
            'payment_method' => $request->payment_method,
            'reference' => $paymentResult['reference'],
        ]);

        return redirect()->route('billing.index')->with('success', "{$units} SMS units added to your account!");
    }

    public function cancelSubscription()
    {
        $user = auth()->user();
        $subscription = $user->subscription;

        if (!$subscription || $subscription->expired()) {
            return back()->with('error', 'No active subscription to cancel.');
        }

        // Suppress the subscription (it will remain active until expiration)
        $subscription->suppress();

        return redirect()->route('billing.index')->with('success', 'Subscription cancelled. Your plan will remain active until the end of the billing period.');
    }

    public function renewSubscription()
    {
        $user = auth()->user();
        $subscription = $user->subscription;

        if (!$subscription) {
            return back()->with('error', 'No subscription found to renew.');
        }

        // Unsuppress if it was cancelled
        if ($subscription->suppressed) {
            $subscription->unsuppress();
        }

        // If expired, renew it
        if ($subscription->expired()) {
            $plan = $subscription->plan;
            $planPrice = $this->getPlanPrice($plan->name);

            // For demo, using wallet payment method
            $paymentResult = $this->processPayment($user, $planPrice, 'wallet');

            if (!$paymentResult['success']) {
                return back()->with('error', 'Payment failed. Please try again.');
            }

            $subscription->renew();

            // Credit plan SMS units
            $smsFeature = $plan->features()->where('name', 'sms-units')->first();
            $planSmsUnits = $smsFeature ? $smsFeature->pivot->charges : 0;

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'renewal',
                'amount' => $planPrice,
                'description' => "Renewal of {$plan->name} plan",
                'status' => 'completed',
                'payment_method' => 'wallet',
                'reference' => $paymentResult['reference'],
            ]);
        }

        return redirect()->route('billing.index')->with('success', 'Subscription renewed successfully!');
    }

    // TODO: make this a database thing
    private function getPlanPrice(string $planName): float
    {
        $prices = [
            'starter' => 3000,
            'starter-yearly' => 3000 * 12 * 0.85, // 15% discount
            'pro' => 5000,
            'pro-yearly' => 5000 * 12 * 0.85,
            'business' => 10000,
            'business-yearly' => 10000 * 12 * 0.85,
            'enterprise' => 20000,
            'enterprise-yearly' => 20000 * 12 * 0.85,
        ];

        return $prices[$planName] ?? 0;
    }

    private function getExtraSmsPrice(string $planName): float
    {
        $prices = [
            'starter' => 5.0,
            'starter-yearly' => 5.0,
            'pro' => 4.95,
            'pro-yearly' => 4.95,
            'business' => 4.8,
            'business-yearly' => 4.8,
            'enterprise' => 4.7,
            'enterprise-yearly' => 4.7,
        ];

        return $prices[$planName] ?? 5.0;
    }

    private function processPayment($user, $amount, $paymentMethod): array
    {
        // Integrate with your payment gateway (Paystack, Flutterwave, etc.)
        // For now, returning success for demo
        return [
            'success' => true,
            'reference' => 'PAY-' . time() . '-' . rand(1000, 9999),
        ];
    }
}
