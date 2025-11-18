<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SenderId>
 */
class SenderIdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'sender_id' => strtoupper($this->faker->lexify('?????')),
            'purpose' => 'marketing',
            'status' => $this->faker->randomElement(['approved', 'pending', 'rejected']),
            'approved_at' => now(),
            'rejected_at' => null,
            'rejection_reason' => null,
        ];
    }
}
