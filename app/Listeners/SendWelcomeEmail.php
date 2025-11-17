<?php

namespace App\Listeners;

use App\Notifications\WelcomeMail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Queue\ShouldQueue;
use LucasDotVin\Soulbscription\Models\Plan;

// use Illuminate\Queue\InteractsWithQueue;
// use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Verified $event): void
    {
        // Access the registered user through $event->user
        $user = $event->user;
        $plan = Plan::where('name', 'free')->first();
        if($plan && !$user->subscription ){
            $user->subscribeTo($plan);
        }
        // Example: Send a welcome email
        $user->notify(new WelcomeMail($user));
    }
}
