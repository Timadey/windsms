<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectSenderIdRequest;
use App\Models\SenderId;
use App\Services\SenderIdService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SenderIdController extends Controller
{
    public function __construct(
        private SenderIdService $senderIdService
    ) {}

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
        $this->senderIdService->approveSenderId($senderId);

        return redirect()->back()
            ->with('success', "Sender ID '{$senderId->sender_id}' has been approved.");
    }

    public function reject(RejectSenderIdRequest $request, SenderId $senderId)
    {
        $this->senderIdService->rejectSenderId(
            $senderId,
            $request->validated()['reason']
        );

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
