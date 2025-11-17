@props(['url'])
<tr>
    <td class="header" style="text-align: center;">
        <a href="{{ $url }}" style="display: inline-block; text-decoration: none;">
            @if (trim($slot) === 'Laravel')
                {{-- Default fallback if slot is Laravel --}}
                <img src="https://acea6d6c5982.ngrok-free.app/windsms-logo.png" class="logo" alt="WindSMS Logo" style="height: 60px; border: none;">
            @else
                {{-- Custom brand logo or text --}}
                <img src="https://acea6d6c5982.ngrok-free.app/windsms-logo-short.png" alt="WindSMS Logo" style="height: 60px; border: none;">
                <h1 style="color: #0284c7; font-size: 20px; margin: 12px 0 0; font-weight: 600; font-family: 'Segoe UI', Roboto, sans-serif;">
                    WindSMS
                </h1>
                <p style="color: #94a3b8; font-size: 14px; margin: 4px 0 0;">
                    Powering your communication with speed & clarity
                </p>
            @endif
        </a>
    </td>
</tr>
