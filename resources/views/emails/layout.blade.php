<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'WindSMS Notification')</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f6f9fc;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #0284c7; /* Sky Blue (WindSMS Primary) */
            color: #fff;
            text-align: center;
            padding: 30px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 30px 40px;
        }
        .content h2 {
            color: #0284c7;
            font-size: 20px;
            margin-bottom: 10px;
        }
        .content p {
            line-height: 1.6;
            font-size: 15px;
            color: #555;
        }
        .button {
            display: inline-block;
            background-color: #0284c7;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            background-color: #f1f5f9;
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #6b7280;
        }
        .footer a {
            color: #0284c7;
            text-decoration: none;
        }
    </style>
</head>
<body>
<div class="email-container">
    <!-- Header -->
    <div class="header">
        <h1>WindSMS</h1>
        <p style="margin: 0; font-size: 14px;">Fast, Reliable, Personalized Messaging</p>
    </div>

    <!-- Content -->
    <div class="content">
        @yield('content')
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>You're receiving this email because you're a registered user of <strong>WindSMS</strong>.</p>
        <p>
            &copy; {{ date('Y') }} WindSMS. All rights reserved.
            <a href="{{ url('/terms') }}">Terms</a> ·
            <a href="{{ url('/privacy') }}">Privacy</a>
        </p>
    </div>
</div>
</body>
</html>
