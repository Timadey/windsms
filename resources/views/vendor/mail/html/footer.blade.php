<tr>
    <td>
        <table class="footer" align="center" width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="background-color:#f8fafc; border-top:1px solid #e2e8f0; margin-top:40px; border-radius:0 0 10px 10px;">
            <tr>
                <td class="content-cell" align="center" style="padding:32px; text-align:center;">
                    <p style="margin:0; color:#64748b; font-size:13px; line-height:1.5;">
                        {{ Illuminate\Mail\Markdown::parse($slot) }}
                    </p>

                    <p style="margin-top:12px; font-size:13px; color:#94a3b8;">
                        © {{ date('Y') }} <strong style="color:#0284c7;">WindSMS</strong>. All rights reserved.
                    </p>

                    <p style="margin-top:4px; font-size:12px; color:#a1a1aa;">
                        You received this email because you’re registered on WindSMS.
                        <a href="{{ config('app.url') }}/unsubscribe" style="color:#0284c7; text-decoration:underline;">Unsubscribe</a>
                    </p>

                    <div style="margin-top:20px;">
                        <a href="https://windsms.com" style="color:#0284c7; font-weight:600; text-decoration:none;">windsms.com</a>
                    </div>
                </td>
            </tr>
        </table>
    </td>
</tr>
