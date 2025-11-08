<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\CampaignController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    // return redirect()->route('login');
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

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

    // Billing
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('billing/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    Route::post('billing/buy-extra', [BillingController::class, 'buyExtraUnits'])->name('billing.buy-extra-units');
    Route::post('billing/cancel', [BillingController::class, 'cancelSubscription'])->name('billing.cancel');
    Route::post('billing/renew', [BillingController::class, 'renewSubscription'])->name('billing.renew');

});

require __DIR__.'/settings.php';
