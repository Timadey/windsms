@props(['url'])
<tr>
    <td class="header" style="background: linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%); padding: 32px 0; text-align: center;">
        <a href="{{ $url }}" style="display: inline-block; text-decoration: none;">
            @if (trim($slot) === 'Laravel')
                {{-- Default fallback if slot is Laravel --}}
                <img src="{{url('/logo.png')}}" class="logo" alt="WindSMS Logo" style="height: 60px; border: none;">
            @else
                {{-- Custom brand logo or text --}}
                <img src="{{url('/logo.png')}}" alt="WindSMS Logo" style="height: 60px; border: none;">
                <h1 style="color: #ffffff; font-size: 20px; margin: 12px 0 0; font-weight: 600; font-family: 'Segoe UI', Roboto, sans-serif;">
                    WindSMS
                </h1>
                <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 4px 0 0;">
                    Powering your communication with speed & clarity
                </p>
            @endif
        </a>
    </td>
</tr>
