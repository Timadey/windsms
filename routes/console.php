<?php

use App\Jobs\RetryPendingSmsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('sms:retry-pending')->everyMinute()->withoutOverlapping()->name('sms:retry-pending');
Schedule::command('sms:ping')->everyThirtySeconds()->withoutOverlapping()->name('sms:ping');
Schedule::command('campaigns:process-recurring')->everyMinute()->withoutOverlapping()->name('campaigns:process-recurring');
