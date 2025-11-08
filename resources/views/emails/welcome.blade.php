@component('mail::message')
    # Welcome to WindSMS 🎉

    Hi {{ $user->name }},

    Welcome to **WindSMS**, your all-in-one bulk SMS and messaging platform.

    We’re excited to have you onboard! You can now start sending SMS campaigns, manage delivery, and reach your audience faster.

    @component('mail::button', ['url' => url('/dashboard')])
        Go to Dashboard
    @endcomponent

    Need help getting started?
    Reply to this email — we’re happy to assist.

    Best regards,
    **The WindSMS Team**
@endcomponent
