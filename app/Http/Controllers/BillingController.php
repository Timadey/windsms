<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\SubscriptionPaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use LucasDotVin\Soulbscription\Models\Plan;

class BillingController extends Controller
{
    public function __construct(
        protected SubscriptionPaymentService $paymentService
    ) {}

    public function index()
    {
        $user = auth()->user();
        $currentSubscription = $user->subscription?->load('plan');

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
                'features' => $plan->features->map(function ($feature) {
                    return [
                        'name' => $feature->name,
                        'consumable' => $feature->consumable,
                        'charges' => $feature->pivot->charges ?? null,
                    ];
                }),
                'extra_sms_price' => $this->getExtraSmsPrice($plan->name),
            ];
        });

        $featureUsage = [];

        if ($currentSubscription) {
            // Get feature usage
            $currentSubscription->plan->extra_sms_price = $this->getExtraSmsPrice($currentSubscription->plan->name);

            foreach ($currentSubscription->plan->features as $feature) {
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
        $smsBalance = $user->balance('sms-units') ?? 0;

        // Get recent transactions
        $transactions = Transaction::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'description' => $transaction->description,
                    'status' => $transaction->status,
                    'payment_method' => $transaction->payment_method,
                    'reference' => $transaction->reference,
                    'created_at' => $transaction->created_at,
                ];
            });

        return Inertia::render('billing/index', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'featureUsage' => $featureUsage,
            'smsBalance' => $smsBalance,
            'transactions' => $transactions,
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'extra_sms_units' => 'nullable|integer|min:0',
        ]);

        try {
            $user = auth()->user();
            $plan = Plan::findOrFail($request->plan_id);
            $extraUnits = $request->extra_sms_units ?? 0;
            // Initialize payment
            $result = $this->paymentService->initializeSubscriptionPayment(
                $user,
                $plan,
                $extraUnits,
                'subscription'
            );
            // dd($result);

            if (!$result['success']) {
                return back()->with('error', $result['message']);
            }

            // Redirect to Paystack checkout
            return Inertia::location($result['authorization_url']);

        } catch (\Exception $e) {
            logger()->error('Subscription initialization failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return back()->with('error', 'Unable to process subscription. Please try again.');
        }
    }

    public function buyExtraUnits(Request $request)
    {
        $request->validate([
            'units' => 'required|integer|min:1',
        ]);

        try {
            $user = auth()->user();
            $units = $request->units;

            // Initialize payment
            $result = $this->paymentService->initializeExtraUnitsPayment($user, $units);

            if (!$result['success']) {
                return back()->with('error', $result['message']);
            }

            // Redirect to Paystack checkout
            return Inertia::location($result['authorization_url']);

        } catch (\Exception $e) {
            logger()->error('Extra units purchase failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return back()->with('error', 'Unable to process purchase. Please try again.');
        }
    }

    public function renewSubscription()
    {
        try {
            $user = auth()->user();
            $subscription = $user->subscription;

            if (!$subscription || is_null($subscription->expired_at)) {
                return back()->with('error', 'No subscription found to renew.');
            }
            // dd($subscription->expired());

            $expiresWithinSevenDays = $subscription->expired_at &&
                $subscription->expired_at->lessThanOrEqualTo(now()->addDays(7));

            if (!$subscription->expired() && !$expiresWithinSevenDays && !$subscription->canceled_at && !$subscription->suppressed_at) {
                return back()->with('error', 'Your subscription is still active.');
            }

            $plan = $subscription->plan;
            // dd($plan);

            // Initialize renewal payment
            $result = $this->paymentService->initializeSubscriptionPayment(
                $user,
                $plan,
                0, // No extra units on renewal
                'renewal'
            );

            if (!$result['success']) {
                return back()->with('error', $result['message']);
            }

            // Redirect to Paystack checkout
            return Inertia::location($result['authorization_url']);

        } catch (\Exception $e) {
            logger()->error('Subscription renewal failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return back()->with('error', 'Unable to process renewal. Please try again.');
        }
    }

    public function cancelSubscription()
    {
        $user = auth()->user();
        $subscription = $user->subscription;

        if (!$subscription || $subscription->expired()) {
            return back()->with('error', 'No active subscription to cancel.');
        }

        // Suppress the subscription (it will remain active until expiration)
        $subscription->cancel();

        return redirect()->route('billing.index')
            ->with('success', 'Subscription cancelled. Your plan will remain active until the end of the billing period.');
    }

    /**
     * Payment callback handler (for redirect after payment)
     */
    public function paymentCallback(Request $request)
    {
        $reference = $request->query('reference');

        if (!$reference) {
            return redirect()->route('billing.index')
                ->with('error', 'Invalid payment reference.');
        }

        // Verify the payment
        $verification = $this->paymentService->verifyPaymentStatus($reference);

        if (!$verification['success']) {
            return redirect()->route('billing.index')
                ->with('error', 'Unable to verify payment. Please contact support if you were charged.');
        }

        $status = $verification['data']['status'] ?? 'failed';

        if ($status === 'success') {
            // Process the webhook data
            $this->paymentService->processPaymentWebhook($verification);

            return redirect()->route('billing.index')
                ->with('success', 'Payment successful! Your subscription has been activated.');
        }

        return redirect()->route('billing.index')
            ->with('error', 'Payment was not successful. Please try again.');
    }

    /**
     * Webhook handler for Paystack
     */
    public function webhook(Request $request)
    {
        $payload = $request->all();
        $event = $payload['event'] ?? null;

        // We only process successful charge events
        if ($event === 'charge.success') {
            try {
                $result = $this->paymentService->processPaymentWebhook($payload);

                return response()->json([
                    'success' => $result['success'],
                    'message' => $result['message'] ?? ($result['error'] ?? 'Processed')
                ]);
            } catch (\Exception $e) {
                logger()->error('Webhook processing error', [
                    'error' => $e->getMessage(),
                    'payload' => $payload
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Processing error'
                ], 500);
            }
        }

        return response()->json(['message' => 'Event received']);
    }

    private function getPlanPrice(string $planName): float
    {
        $prices = [
            'free' => 0,
            // 'starter-yearly' => 3000 * 12 * 0.85,
            'pro' => 4998.98,
            'pro-yearly' => 4998.98 * 12 * 0.85,
            'business' => 9997.99,
            'business-yearly' => 9997.99 * 12 * 0.85,
            'enterprise' => 19995.99,
            'enterprise-yearly' => 19995.99 * 12 * 0.85,
        ];

        return $prices[$planName] ?? 0;
    }

    private function getExtraSmsPrice(string $planName): float
    {
        $prices = [
            'free' => 5.0,
            // 'starter-yearly' => 5.0,
            'pro' => 4.95,
            'pro-yearly' => 4.95,
            'business' => 4.8,
            'business-yearly' => 4.8,
            'enterprise' => 4.7,
            'enterprise-yearly' => 4.7,
        ];

        return $prices[$planName] ?? 5.0;
    }
}
