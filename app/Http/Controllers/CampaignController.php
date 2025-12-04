<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateSpintaxRequest;
use App\Http\Requests\StoreCampaignRequest;
use App\Models\Campaign;
use App\Models\SenderId;
use App\Models\Tag;
use App\Services\Ai\AiServiceManager;
use App\Services\CampaignService;
use App\Shared\Enums\FeaturesEnum;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function __construct(
        protected CampaignService $campaignService
    ) {}

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

        $senderIds = SenderId::where('user_id', $request->user()->id)
            ->approved()
            ->get();

        return Inertia::render('Campaigns/Create', [
            'tags' => $tags,
            'senderIds' => $senderIds,
        ]);
    }

    public function store(StoreCampaignRequest $request)
    {
        try {
            $campaign = $this->campaignService->createCampaign(
                $request->validated(),
                $request->user()
            );

            $message = $this->campaignService->getSuccessMessage(
                $request->validated(),
                $campaign->status,
                $campaign->dispatch_at
            );

            return redirect()->route('campaigns.index')->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(Campaign $campaign)
    {
        if ($campaign->user_id !== auth()->id()) {
            abort(403);
        }

        $logs = $campaign->logs()->with('subscriber')->paginate(10);
        $campaign->setRelation('logs', $logs);

        return Inertia::render('Campaigns/Show', [
            'campaign' => $campaign,
        ]);
    }

    public function generateSpintax(GenerateSpintaxRequest $request, AiServiceManager $aiService)
    {
        $user = $request->user();

        if ($user->cantConsume(FeaturesEnum::mixer->value, 1)) {
            return response()->json(['error' => 'You do not have enough credits to use this feature.']);
        }

        $spintax = $aiService->generateSpintax($request->validated()['message']);

        if (!empty($spintax)) {
            $user->consume(FeaturesEnum::mixer->value, 1);
        }

        logger()->debug("Debug spintax: sending response now");

        return response()->json([
            'spintax' => $spintax,
        ]);
    }

    public function restart(Campaign $campaign)
    {
        if ($campaign->user_id !== auth()->id()) {
            abort(403);
        }

        try {
            $this->campaignService->restartCampaign($campaign);
            return redirect()->back()->with('success', 'Campaign restarted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
