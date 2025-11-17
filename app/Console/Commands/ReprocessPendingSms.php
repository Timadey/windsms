<?php

namespace App\Console\Commands;

use App\Jobs\RetryPendingSmsJob;
use App\Jobs\SendCampaignSms;
use App\Models\Campaign;
use App\Models\CampaignLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ReprocessPendingSms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sms:retry-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and dispatch pending sms';

    public int $maxRetries = 5; // Maximum retry attempts per message


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pendingLogs = CampaignLog::where('status', 'pending')
            ->where(function ($query) {
                $query->whereNull('next_retry_at')
                    ->orWhere('next_retry_at', '<=', now());
            })
            ->where('retry_count', '<', $this->maxRetries)
            ->exists();

        if (!$pendingLogs) {
            $this->info('No pending SMS messages to retry');
            return 0;
        }
        RetryPendingSmsJob::dispatch();
        $this->info('Dispatched pending SMS messages for retry');
        return 0;
    }
}
