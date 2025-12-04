<?php

namespace App\Console\Commands;

use App\Services\Sms\Providers\MtnSmsProvider;
use Illuminate\Console\Command;
use App\Services\Sms\SmsService;

class PingBulkSms extends Command
{
    protected $signature = 'sms:ping';
    protected $description = 'Ping MTN BulkSMS session every 5 seconds';

    public function handle()
    {
        $smsService = app(MtnSmsProvider::class);

        $response = $smsService->pingSession();

        if ($response) {
            $this->info('✅ Session active: ' . json_encode($response));
        } else {
            $this->error('⚠️ Session ping failed.');
            // TODO: use a post request instead to spark it up
            $response = $smsService->getSmsBundle();
            if ($response) {
                $this->info('✅ Get SMS Bundle to spark session up: ' . json_encode($response));
            } else {
                $this->error('❌ Fetched SMS Bundle failed! Notify admin!.');
            }
        }
    }
}
