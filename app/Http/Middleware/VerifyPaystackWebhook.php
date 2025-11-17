<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyPaystackWebhook
{
    protected array $whitelistedIps = [
        '52.31.139.75',
        '52.49.173.169',
        '52.214.14.220',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // we are going to log all webhooks from paystack in json format, should in case we need to repush by ourselves, due to failure
        logger()->channel('paystack')->info($request->getContent());
        // Ensure POST + signature exists
        if ($request->method() !== 'POST' || !$request->hasHeader('x-paystack-signature')) {
            return response('Invalid request', 400);
        }

        // IP Whitelisting
        if (!in_array(get_request_ip($request), $this->whitelistedIps)) {
            return response('Unauthorized IP', 403);
        }

        // Signature validation
        $secret = config('services.paystack.secret');
        $signature = $request->header('x-paystack-signature');
        $computed = hash_hmac('sha512', $request->getContent(), $secret);

        if (!hash_equals($signature, $computed)) {
            return response('Invalid signature', 403);
        }

        return $next($request);
    }
}
