<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeMail extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $user) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to WindSMS 🎉')
            ->greeting('Hi ' . $this->user->name . ',')
            ->line('Welcome to **WindSMS**, your all-in-one bulk SMS and messaging platform.')
            ->line('We’re excited to have you onboard!')
            ->line('As a welcome gift from us, you just got 🎁 **10 FREE SMS Unit** to enjoy our service before even committing to our plans. You can now start sending SMS campaigns, manage delivery, and reach your audience faster.')
            ->action('Send your first SMS', url('/campaign/create'))
            ->line('Need help getting started? Reply to this email — we’re happy to assist.')
            ->salutation('Best regards,
                The WindSMS Team');
    }
}
