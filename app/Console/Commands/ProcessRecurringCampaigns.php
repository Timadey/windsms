<?php

namespace App\Console\Commands;

use App\Jobs\SendCampaignSms;
use App\Models\Campaign;
use Illuminate\Console\Command;

class ProcessRecurringCampaigns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaigns:process-recurring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and dispatch scheduled recurring campaigns';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Processing scheduled recurring campaigns...');

        $campaigns = Campaign::where(function ($q) {
            $q->where('status', 'scheduled')
                ->where('dispatch_at', '<=', now());
        })
            ->orWhere(function ($q) {
                $q->where('status', 'processing')
                    ->where('dispatch_at', '<=', now())
                    ->whereDoesntHave('campaignLogs');
            })
            ->get();

        if ($campaigns->isEmpty()) {
            $this->info('No campaigns ready for dispatch.');
            return 0;
        }

        $count = 0;
        foreach ($campaigns as $campaign) {
            $this->info("Dispatching campaign: {$campaign->name} (ID: {$campaign->id})");

            $campaign->update(['status' => 'processing']);
            SendCampaignSms::dispatch($campaign);
            $count++;
        }

        $this->info("Successfully dispatched {$count} campaign(s).");
        return 0;
    }
}
