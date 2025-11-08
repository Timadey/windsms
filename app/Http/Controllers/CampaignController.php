<?php

namespace App\Http\Controllers;

use App\Jobs\SendCampaignSms;
use App\Models\Campaign;
use App\Models\Subscriber;
use App\Models\Tag;
use App\Services\Ai\AiServiceManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $campaigns = Campaign::where('user_id', $request->user()->id)
            ->withCount('logs')
            ->latest()
            ->paginate(10);

        return Inertia::render('Campaigns/Index', [
            'campaigns' => $campaigns,
        ]);
    }

    public function create(Request $request)
    {
        $tags = Tag::where('user_id', $request->user()->id)
            ->withCount('subscribers')
            ->get();

        return Inertia::render('Campaigns/Create', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string',
            'spintax_message' => 'nullable|string',
            'tag_ids' => 'required|array|min:1',
            'tag_ids.*' => 'exists:tags,id',
            'dispatch_at' => 'nullable|date|after:now',
            'dispatch_now' => 'boolean',
        ]);

        // Count total recipients
        $totalRecipients = Subscriber::where('user_id', $request->user()->id)
            ->whereHas('tags', function ($q) use ($validated) {
                $q->whereIn('tags.id', $validated['tag_ids']);
            })
            ->distinct()
            ->count();

        $campaign = Campaign::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'message' => $validated['message'],
            'spintax_message' => $validated['spintax_message'] ?? $validated['message'],
            'tag_ids' => $validated['tag_ids'],
            'dispatch_at' => $validated['dispatch_now'] ?? false ? now() : ($validated['dispatch_at'] ?? null),
            'status' => ($validated['dispatch_now'] ?? false) ? 'processing' : 'scheduled',
            'total_recipients' => $totalRecipients,
        ]);

        // Dispatch immediately if requested
        if ($validated['dispatch_now'] ?? false) {
            SendCampaignSms::dispatch($campaign);
        }

        return redirect()->route('campaigns.index')->with('success', 'Campaign created successfully.');
    }

    public function show(Campaign $campaign)
    {
        if ($campaign->user_id !== auth()->id()) {
            abort(403);
        }

        $logs = $campaign->logs()->with('subscriber')->paginate(10);
        $campaign->setRelation('logs', $logs);
        // $campaign->load(['logs.subscriber']);

        return Inertia::render('Campaigns/Show', [
            'campaign' => $campaign,
        ]);
    }

    public function generateSpintax(Request $request, AiServiceManager $aiService)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $spintax = $aiService->generateSpintax($validated['message']);

        return response()->json([
            'spintax' => $spintax,
        ]);
    }

    public function restart(Campaign $campaign)
    {
        if ($campaign->user_id !== auth()->id()) {
            abort(403);
        }

        if (!in_array($campaign->status, ['paused', 'failed'])) {
            return redirect()->back()->with('error', 'Only paused or failed campaigns can be restarted.');
        }

        $campaign->update(['status' => 'processing']);
        SendCampaignSms::dispatch($campaign);

        return redirect()->back()->with('success', 'Campaign restarted successfully.');
    }
}
