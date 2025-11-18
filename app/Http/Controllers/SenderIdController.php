<?php

namespace App\Http\Controllers;

use App\Models\SenderId;
use App\Shared\Enums\FeaturesEnum;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SenderIdController extends Controller
{
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => [
                'required',
                'string',
                'max:11',
                'regex:/^[A-Za-z0-9 ]+$/', // Only alphanumeric
                'unique:sender_ids,sender_id,NULL,id,user_id,' . $request->user()->id,
            ],
            'purpose' => 'required|string|max:500',
        ], [
            'sender_id.regex' => 'Sender ID must contain only letters, numbers and decent spaces.',
            'sender_id.unique' => 'You have already applied for this sender ID.',
        ]);

        // validate that the user can upload this number of senderID
        $user = $request->user();
        if ($user->cantConsume(FeaturesEnum::sender->value, 1))
        {
            return back()->with('error', "You do not have enough credits to add a sender ID.");
        }

        $user->consume(FeaturesEnum::sender->value, 1);

        SenderId::create([
            'user_id' => $request->user()->id,
            'sender_id' => $validated['sender_id'], // Convert to uppercase
            'purpose' => $validated['purpose'],
            'status' => 'pending',
        ]);

        return redirect()->route('sender-ids.index')
            ->with('success', 'Sender ID application submitted successfully. It will be reviewed by our team.');
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

        // Only allow deletion of pending or rejected sender IDs
        if ($senderId->status === 'approved') {
            return redirect()->back()
                ->with('error', 'Cannot delete approved sender IDs. Please contact support.');
        }

        $senderId->delete();

        return redirect()->route('sender-ids.index')
            ->with('success', 'Sender ID deleted successfully.');
    }
}
