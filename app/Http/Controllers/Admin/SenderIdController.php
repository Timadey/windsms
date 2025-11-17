<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SenderId;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SenderIdController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = SenderId::with('user')->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $senderIds = $query->paginate(20);

        return Inertia::render('admin/senderIds/index', [
            'senderIds' => $senderIds,
            'currentStatus' => $status,
        ]);
    }

    public function approve(SenderId $senderId)
    {
        $senderId->approve();

        return redirect()->back()
            ->with('success', "Sender ID '{$senderId->sender_id}' has been approved.");
    }

    public function reject(Request $request, SenderId $senderId)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $senderId->reject($validated['reason']);

        return redirect()->back()
            ->with('success', "Sender ID '{$senderId->sender_id}' has been rejected.");
    }

    public function destroy(SenderId $senderId)
    {
        $senderId->delete();

        return redirect()->back()
            ->with('success', 'Sender ID deleted successfully.');
    }
}
