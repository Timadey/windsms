<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use LucasDotVin\Soulbscription\Models\Plan;

class SubscriptionPaymentService
{
    /**
     * Initialize payment for a new subscription or renewal
     */
    public function initializeSubscriptionPayment(
        User $user,
        Plan $plan,
        int $extraSmsUnits = 0,
        string $type = 'subscription' // 'subscription' or 'renewal'
    ): array {
        // Calculate amounts
        $planPrice = $this->getPlanPrice($plan->name);
        $extraSmsPrice = $this->getExtraSmsPrice($plan->name);
        $extraSmsCost = $extraSmsUnits * $extraSmsPrice;
        $totalAmount = $planPrice + $extraSmsCost;

        // Check for existing pending transaction
        $existingTransaction = Transaction::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('type', $type)
            ->where('amount', $totalAmount)
            ->first();

        if ($existingTransaction) {
            // Verify if payment was actually successful
            $verificationResult = $this->verifyPaymentStatus($existingTransaction->reference);

            if ($verificationResult['success'] && $verificationResult['data']['status'] === 'success') {
                // Payment was successful but webhook might have failed
                $this->processPaymentWebhook($verificationResult);

                return [
                    'success' => false,
                    'message' => 'This payment has already been completed successfully.',
                    'transaction_id' => $existingTransaction->id
                ];
            }
        }

        return DB::transaction(function () use ($user, $plan, $extraSmsUnits, $totalAmount, $type, $planPrice, $extraSmsCost) {
            // Generate unique payment reference
            $reference = $this->generatePaymentReference($user->id, $type);

            // Create transaction record
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => $type,
                'amount' => $totalAmount,
                'description' => $this->getTransactionDescription($plan->name, $type, $extraSmsUnits),
                'status' => 'pending',
                'payment_method' => 'paystack',
                'reference' => $reference,
                'metadata' => [
                    'plan_id' => $plan->id,
                    'plan_name' => $plan->name,
                    'plan_price' => $planPrice,
                    'extra_sms_units' => $extraSmsUnits,
                    'extra_sms_cost' => $extraSmsCost,
                    'payment_type' => $type
                ]
            ]);

            // Initialize payment with Paystack
            $paystackResponse = $this->initializePaystackPayment($user, $transaction, $totalAmount);

            if (!$paystackResponse['success']) {
                // Mark transaction as failed
                $transaction->update(['status' => 'failed']);

                throw new \Exception($paystackResponse['message'] ?? 'Unable to initialize payment');
            }

            Log::info('Subscription payment initialized', [
                'user_id' => $user->id,
                'transaction_id' => $transaction->id,
                'plan' => $plan->name,
                'amount' => $totalAmount,
                'reference' => $reference,
                'type' => $type
            ]);

            return [
                'success' => true,
                'transaction_id' => $transaction->id,
                'reference' => $reference,
                'authorization_url' => $paystackResponse['data']['authorization_url'],
                'access_code' => $paystackResponse['data']['access_code'],
                'amount' => $totalAmount,
                'plan' => $plan->name
            ];
        });
    }

    /**
     * Process Paystack webhook for subscription payment
     *
     * TODO: Make this a job
     */
    public function processPaymentWebhook(array $payload): array
    {
        $reference = $payload['data']['reference'] ?? null;

        if (!$reference) {
            Log::error('Webhook received without reference', ['payload' => $payload]);
            return [
                'success' => false,
                'error' => 'Invalid webhook payload: missing reference'
            ];
        }

        $transaction = Transaction::where('reference', $reference)
            ->where('status', 'pending')
            ->first();

        if (!$transaction) {
            Log::warning('Transaction not found or already processed', ['reference' => $reference]);
            return [
                'success' => false,
                'error' => 'Transaction not found or already processed'
            ];
        }

        return DB::transaction(function () use ($transaction, $payload) {
            $webhookData = $payload['data'];

            // Verify payment details
            $expectedAmount = $transaction->amount * 100; // Convert to kobo
            $paidAmount = $webhookData['amount'] ?? 0;
            $status = $webhookData['status'] ?? '';

            if ($status !== 'success') {
                $transaction->update([
                    'status' => 'failed',
                    'metadata' => array_merge($transaction->metadata ?? [], [
                        'webhook_data' => $webhookData,
                        'failure_reason' => 'Payment not successful'
                    ])
                ]);

                Log::warning('Payment failed', [
                    'transaction_id' => $transaction->id,
                    'reference' => $transaction->reference,
                    'status' => $status
                ]);

                return [
                    'success' => false,
                    'error' => 'Payment was not successful'
                ];
            }

            if ($paidAmount < $expectedAmount) {
                $transaction->update([
                    'status' => 'failed',
                    'metadata' => array_merge($transaction->metadata ?? [], [
                        'webhook_data' => $webhookData,
                        'failure_reason' => 'Amount mismatch',
                        'expected_amount' => $expectedAmount,
                        'paid_amount' => $paidAmount
                    ])
                ]);

                Log::warning('Payment amount mismatch', [
                    'transaction_id' => $transaction->id,
                    'expected' => $expectedAmount,
                    'paid' => $paidAmount
                ]);

                return [
                    'success' => false,
                    'error' => 'Payment amount does not match expected amount'
                ];
            }

            // Payment is valid, process based on transaction type
            $user = $transaction->user;
            $metadata = $transaction->metadata;
            $paymentType = $metadata['payment_type'] ?? 'subscription';

            // Handle different payment types
            match ($paymentType){
                'extra_sms' =>  $this->processExtraSmsUnits($user, $metadata),
                'renewal' => $this->processRenewal($user, $metadata),
                default =>  $this->processNewSubscription($user, $metadata),
            };

            // Update transaction status
            $transaction->update([
                'status' => 'completed',
                'metadata' => array_merge($metadata, [
                    'webhook_data' => $webhookData,
                    'processed_at' => now()->toISOString()
                ])
            ]);

            Log::info('Payment processed successfully', [
                'transaction_id' => $transaction->id,
                'user_id' => $user->id,
                'type' => $paymentType
            ]);

            return [
                'success' => true,
                'message' => 'Payment processed successfully',
                'transaction_id' => $transaction->id
            ];
        }, 5);
    }

    /**
     * Process extra SMS units purchase
     */
    protected function processExtraSmsUnits(User $user, array $metadata): void
    {
        $units = $metadata['units'] ?? 0;

        if ($units <= 0) {
            throw new \Exception('Invalid SMS units amount');
        }

        // Credit the SMS units
        $user->giveTicketFor('sms-units', charges: intval($units));

        Log::info('Extra SMS units credited', [
            'user_id' => $user->id,
            'units' => $units,
            'new_balance' => $user->balance('sms-units')
        ]);
    }

    /**
     * Process new subscription
     */
    public function processNewSubscription(User $user, array $metadata): void
    {
        $plan = Plan::find($metadata['plan_id']);
        if (!$plan) {
            throw new \Exception('Plan not found');
        }

        $existingSubscription = $user->subscription;
        $isSwitching = $existingSubscription && !$existingSubscription->expired();
        $currentSmsBalance = $user->balance('sms-units');

        Log::info('Processing subscription', [
            'user_id' => $user->id,
            'is_switching' => $isSwitching,
            'current_balance' => $currentSmsBalance,
            'new_plan' => $plan->name
        ]);

        // Cancel existing subscription if any and switch/subscribe
        if ($isSwitching) {
            // CRITICAL: Don't use switchTo() - it carries over consumption!
            // Instead, we'll manually cancel and create a new subscription

            // Step 1: Cancel the old subscription
            $existingSubscription->suppress();

            // Step 2: Create a completely new subscription (fresh start)
            $user->subscribeTo($plan);

            // Step 3: Add the old balance on top of the new plan's allocation
            if ($currentSmsBalance > 0) {
                $smsFeature = $user->getFeature('sms-units');
                // clear all consumptions yet to expire also
                $user->featureConsumptions()->where('feature_id', $smsFeature->id)
                    ->whereDate('expired_at', '>=', now())->update(['expired_at' => now()]);
                // make all feature tickets expire.
                $user->featureTickets()->where('feature_id', $smsFeature->id)
                    ->whereNull('expired_at')->update(['expired_at' => now()]);
                // start a new ticket
                $user->giveTicketFor('sms-units', charges: intval($currentSmsBalance));

                Log::info('Restored SMS balance after plan change', [
                    'user_id' => $user->id,
                    'restored_balance' => $currentSmsBalance
                ]);
            }
        } else {
            $user->subscribeTo($plan);
        }

        // Credit extra SMS units if purchased
        $extraSmsUnits = $metadata['extra_sms_units'] ?? 0;
        if ($extraSmsUnits > 0) {
            $user->giveTicketFor('sms-units', charges: intval($extraSmsUnits));
        }

        $finalBalance = $user->balance('sms-units');

        Log::info('New subscription activated', [
            'user_id' => $user->id,
            'plan' => $plan->name,
            'extra_sms_units' => $extraSmsUnits,
            'previous_balance' => $currentSmsBalance,
            'final_balance' => $finalBalance
        ]);
    }

    /**
     * Process subscription renewal
     */
    protected function processRenewal(User $user, array $metadata): void
    {
        $subscription = $user->subscription;

        $plan = Plan::find($metadata['plan_id']);
        if (!$plan) {
            throw new \Exception('Plan not found');
        }

        if (!$subscription) {
            throw new \Exception('No subscription found to renew');
        }

        // Renew the subscription
        $subscription->renew();

        // Credit plan SMS units (renewal restores the plan's SMS allocation)
        $smsFeature = $plan->features()->where('name', 'sms-units')->first();
        if ($smsFeature) {
            $planSmsUnits = $smsFeature->pivot->charges ?? 0;
            if ($planSmsUnits > 0) {
                $user->giveTicketFor('sms-units', charges: intval($planSmsUnits));
            }
        }

        Log::info('Subscription renewed', [
            'user_id' => $user->id,
            'plan' => $plan->name,
            'subscription_id' => $subscription->id
        ]);
    }

    /**
     * Initialize payment with Paystack
     */
    protected function initializePaystackPayment(User $user, Transaction $transaction, float $amount): array
    {
        $payload = [
            'email' => $user->email,
            'currency' => 'NGN',
            'amount' => $amount * 100, // Convert to kobo
            'reference' => $transaction->reference,
            'callback_url' => route('subscription.payment.callback'),
            'metadata' => [
                'transaction_id' => $transaction->id,
                'user_id' => $user->id,
                'custom_fields' => [
                    [
                        'display_name' => 'User Name',
                        'variable_name' => 'user_name',
                        'value' => $user->name
                    ],
                    [
                        'display_name' => 'Transaction Type',
                        'variable_name' => 'transaction_type',
                        'value' => $transaction->type
                    ]
                ]
            ]
        ];

        try {
            $response = Http::withToken(config('services.paystack.secret'))
                ->timeout(30)
                ->asJson()
                ->post(config('services.paystack.base_url') . '/transaction/initialize', $payload);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => $data['status'] ?? false,
                    'message' => $data['message'] ?? 'Payment initialized',
                    'data' => $data['data'] ?? []
                ];
            }

            Log::error('Paystack initialization failed', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);

            return [
                'success' => false,
                'message' => 'Unable to initialize payment with Paystack',
                'error' => $response->json()
            ];
        } catch (\Exception $e) {
            Log::error('Paystack API error', [
                'error' => $e->getMessage(),
                'transaction_id' => $transaction->id
            ]);

            return [
                'success' => false,
                'message' => 'Payment gateway error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verify payment status with Paystack
     */
    public function verifyPaymentStatus(string $reference): array
    {
        try {
            $response = Http::withToken(config('services.paystack.secret'))
                ->timeout(30)
                ->get(config('services.paystack.base_url') . '/transaction/verify/' . $reference);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => $data['status'] ?? false,
                    'message' => $data['message'] ?? 'Verification complete',
                    'data' => $data['data'] ?? []
                ];
            }

            return [
                'success' => false,
                'message' => 'Unable to verify payment status',
                'error' => $response->json()
            ];
        } catch (\Exception $e) {
            Log::error('Payment verification error', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Verification error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Generate unique payment reference
     */
    protected function generatePaymentReference(int $userId, string $type): string
    {
        $prefix = match ($type) {
            'renewal' => 'REN',
            'extra_sms' => 'SMS',
            default => 'SUB',
        };

        return strtoupper(sprintf(
            '%s-%s-%s-%s',
            $prefix,
            $userId,
            now()->format('YmdHis'),
            Str::random(6)
        ));
    }

    /**
     * Get transaction description
     */
    protected function getTransactionDescription(string $planName, string $type, int $extraUnits): string
    {
        $action = $type === 'renewal' ? 'Renewal of' : 'Subscription to';
        $description = "{$action} {$planName} plan";

        if ($extraUnits > 0) {
            $description .= " + {$extraUnits} extra SMS units";
        }

        return $description;
    }

    /**
     * Get plan price
     * // TODO: make this reside in the data base and use across the application
     */
    protected function getPlanPrice(string $planName): float
    {
        $prices = [
            'free' => 0,
            'pro' => 4998.98,
            'pro-yearly' => 4998.98 * 12 * 0.85,
            'business' => 9997.99,
            'business-yearly' => 9997.99 * 12 * 0.85,
            'enterprise' => 19995.99,
            'enterprise-yearly' => 19995.99 * 12 * 0.85,
        ];

        return $prices[$planName] ?? 0;
    }

    /**
     * Get extra SMS price based on user's plan
     */
    protected function getExtraSmsPrice(string $planName): float
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

    /**
     * Buy extra SMS units (separate from subscription)
     */
    public function initializeExtraUnitsPayment(User $user, int $units): array
    {
        $subscription = $user->subscription;

        if (!$subscription || $subscription->expired()) {
            return [
                'success' => false,
                'message' => 'You must have an active subscription to purchase extra SMS units.'
            ];
        }

        $pricePerUnit = $this->getExtraSmsPrice($subscription->plan->name);
        $totalAmount = $units * $pricePerUnit;

        return DB::transaction(function () use ($user, $units, $totalAmount, $pricePerUnit) {
            $reference = $this->generatePaymentReference($user->id, 'extra_sms');

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'extra_sms',
                'amount' => $totalAmount,
                'description' => "Purchase of {$units} extra SMS units",
                'status' => 'pending',
                'payment_method' => 'paystack',
                'reference' => $reference,
                'metadata' => [
                    'units' => $units,
                    'price_per_unit' => $pricePerUnit,
                    'payment_type' => 'extra_sms'
                ]
            ]);

            $paystackResponse = $this->initializePaystackPayment($user, $transaction, $totalAmount);

            if (!$paystackResponse['success']) {
                $transaction->update(['status' => 'failed']);
                throw new \Exception($paystackResponse['message'] ?? 'Unable to initialize payment');
            }

            Log::info('Extra SMS units payment initialized', [
                'user_id' => $user->id,
                'transaction_id' => $transaction->id,
                'units' => $units,
                'amount' => $totalAmount,
                'reference' => $reference
            ]);

            return [
                'success' => true,
                'transaction_id' => $transaction->id,
                'reference' => $reference,
                'authorization_url' => $paystackResponse['data']['authorization_url'],
                'access_code' => $paystackResponse['data']['access_code'],
                'amount' => $totalAmount,
                'units' => $units
            ];
        });
    }
}
