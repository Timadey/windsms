<?php

use App\Jobs\RetryPendingSmsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(RetryPendingSmsJob::class)->everyMinute();
Schedule::command('sms:ping')->everyThirtySeconds();
