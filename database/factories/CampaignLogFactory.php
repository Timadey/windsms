<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\Subscriber;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CampaignLog>
 */
class CampaignLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // make most messages succeed
        $status = $this->faker->boolean(90) ? 'sent' : 'failed';

        return [
            'campaign_id' => Campaign::factory(),
            'subscriber_id' => Subscriber::factory(),
            'phone_number' => $this->faker->phoneNumber,
            'message_sent' => $this->faker->sentence,
            'status' => $status,
            'error_message' => $status === 'failed' ? 'Network error' : null,
            'sent_at' => now(),
            'retry_count' => 0,
            'next_retry_at' => null,
        ];
    }
}
