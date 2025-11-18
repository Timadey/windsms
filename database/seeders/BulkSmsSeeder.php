<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\CampaignLog;
use App\Models\Subscriber;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BulkSmsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 users
        User::factory(1)->create()->each(function ($user) {

            // Create 10-20 subscribers per user
            $subscribers = Subscriber::factory(rand(10, 20))
                ->for($user)
                ->create();

            // Create 3-5 tags per user
            $tags = Tag::factory(rand(3, 5))
                ->for($user)
                ->create();

            // Assign some tags randomly to subscribers
            foreach ($subscribers as $subscriber) {
                $subscriber->tags()->attach($tags->random(rand(1, 3))->pluck('id')->toArray());
            }

            // Create 3-5 campaigns per user
            Campaign::factory(rand(3, 5))
                ->for($user)
                ->create()
                ->each(function ($campaign) use ($subscribers) {

                    $totalRecipients = $subscribers->count();

                    // Update campaign phone_numbers and total_recipient counts
                    $campaign->update([
                        'phone_numbers' => $subscribers->pluck('phone_number')->toArray(),
                        'total_recipients' => $totalRecipients,
                        'pending_count' => $totalRecipients,
                    ]);

                    // Create campaign logs for each subscriber
                    foreach ($subscribers as $subscriber) {
                        $status = rand(1, 100) <= 98 ? 'sent' : 'failed'; // 90% success
                        $campaignLog = CampaignLog::factory()->make([
                            'campaign_id' => $campaign->id,
                            'subscriber_id' => $subscriber->id,
                            'phone_number' => $subscriber->phone_number,
                            'status' => $status,
                            'sent_at' => now(),
                            'retry_count' => 0,
                            'error_message' => $status === 'failed' ? 'Network error' : null,
                        ]);

                        $campaignLog->save();

                        // Update campaign counters
                        $campaign->increment($status === 'sent' ? 'sent_count' : 'failed_count');
                        $campaign->decrement('pending_count');
                    }

                    $campaign->update([
                        'status' => 'completed',
                        'completed_at' => now(),
                    ]);
                });
        });
    }
}
