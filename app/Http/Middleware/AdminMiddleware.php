<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userEmail = $request->user()?->email;
        if ($userEmail && in_array($userEmail, config('app.admin_emails'))) {
            return $next($request);
        }
        return response('Unauthorized.', 401);
    }
}
