<?php

use App\Http\Controllers\BillingController;
// Webhook route (no auth middleware - Paystack calls this)
Route::middleware('paystack.webhook')->post('/webhooks/paystack/subscription', [BillingController::class, 'webhook'])
    ->name('webhooks.paystack.subscription');
