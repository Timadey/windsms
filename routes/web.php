<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SenderIdController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\Admin\SenderIdController as AdminSenderIdController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    // return redirect()->route('login');
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/stories', function () {
    return Inertia::render('stories');
})->name('stories');

Route::get('/pricing', function () {
    return Inertia::render('pricingpage');
})->name('pricing');

Route::get('/contact', function () {
    return Inertia::render('contactpage');
})->name('contact');

Route::get('/privacy', function () {
    return Inertia::render('privacypolicy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('termspage');
})->name('terms');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Subscribers
    Route::get('subscribers', [SubscriberController::class, 'index'])->name('subscribers.index');
    Route::post('subscribers', [SubscriberController::class, 'store'])->name('subscribers.store');
    Route::put('subscribers/{subscriber}', [SubscriberController::class, 'update'])->name('subscribers.update');
    Route::delete('subscribers/{subscriber}', [SubscriberController::class, 'destroy'])->name('subscribers.destroy');
    Route::post('subscribers/bulk-import', [SubscriberController::class, 'bulkImport'])->name('subscribers.bulk-import');

    // Tags
    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('tags', [TagController::class, 'store'])->name('tags.store');
    Route::put('tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    // Campaigns
    Route::get('campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
    Route::get('campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
    Route::post('campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
    Route::get('campaigns/{campaign}', [CampaignController::class, 'show'])->name('campaigns.show');
    Route::post('campaigns/generate-spintax', [CampaignController::class, 'generateSpintax'])->name('campaigns.generate-spintax');

    // Billing dashboard
    Route::get('/billing', [BillingController::class, 'index'])->name('billing.index');
    // Subscribe to a plan
    Route::post('/billing/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    // Buy extra SMS units
    Route::post('/billing/extra-units', [BillingController::class, 'buyExtraUnits'])->name('billing.extra-units');
    // Renew subscription
    Route::post('/billing/renew', [BillingController::class, 'renewSubscription'])->name('billing.renew');
    // Cancel subscription
    Route::post('/billing/cancel', [BillingController::class, 'cancelSubscription'])->name('billing.cancel');
    // Payment callback (after Paystack redirect)
    Route::get('/subscription/payment/callback', [BillingController::class, 'paymentCallback'])
        ->name('subscription.payment.callback');

    // User Sender ID Routes
    Route::resource('sender-ids', SenderIdController::class)->only([
        'index', 'create', 'store', 'show', 'destroy'
    ]);

    // Admin Sender ID Routes (add middleware for admin)
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('sender-ids', [AdminSenderIdController::class, 'index'])->name('admin.sender-ids.index');
        Route::post('sender-ids/{senderId}/approve', [AdminSenderIdController::class, 'approve'])->name('admin.sender-ids.approve');
        Route::post('sender-ids/{senderId}/reject', [AdminSenderIdController::class, 'reject'])->name('admin.sender-ids.reject');
        Route::delete('sender-ids/{senderId}', [AdminSenderIdController::class, 'destroy'])->name('admin.sender-ids.destroy');
    });
});

require __DIR__.'/settings.php';
