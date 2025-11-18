<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalRecipients = $this->faker->numberBetween(1000, 5000);

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->sentence(3),
            'message' => $this->faker->paragraph,
            'spintax_message' => $this->faker->sentence,
            'sender_id' => strtoupper($this->faker->lexify('?????')),
            'tag_ids' => [],
            'phone_numbers' => [], // populate later if needed
            'recipient_type' => 'tags',
            'dispatch_at' => $this->faker->dateTimeBetween('-1 week', '+1 week'),
            'status' => 'processing',
            'total_recipients' => $totalRecipients,
            'sent_count' => 0,
            'failed_count' => 0,
            'pending_count' => $totalRecipients,
            'is_recurring' => false,
            'recurrence_type' => null,
            'recurrence_interval' => null,
            'recurrence_end_date' => null,
            'last_run_at' => null,
            'next_run_at' => null,
        ];
    }
}
