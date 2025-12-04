<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSenderIdRequest;
use App\Models\SenderId;
use App\Services\SenderIdService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SenderIdController extends Controller
{
    public function __construct(
        protected SenderIdService $senderIdService
    ) {}

    public function index(Request $request)
    {
        $senderIds = SenderId::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('senderIds/index', [
            'senderIds' => $senderIds,
        ]);
    }

    public function create()
    {
        return Inertia::render('senderIds/create');
    }

    public function store(StoreSenderIdRequest $request)
    {
        try {
            $this->senderIdService->createSenderIdApplication(
                $request->validated(),
                $request->user()
            );

            return redirect()->route('sender-ids.index')
                ->with('success', 'Sender ID application submitted successfully. It will be reviewed by our team.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(SenderId $senderId)
    {
        if ($senderId->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('senderIds/show', [
            'senderId' => $senderId,
        ]);
    }

    public function destroy(SenderId $senderId)
    {
        if ($senderId->user_id !== auth()->id()) {
            abort(403);
        }

        try {
            $this->senderIdService->deleteSenderId($senderId);
            return redirect()->route('sender-ids.index')
                ->with('success', 'Sender ID deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
