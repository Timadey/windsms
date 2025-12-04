<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSingleSmsRequest;
use App\Models\CampaignLog;
use App\Models\SenderId;
use App\Services\SingleSmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SingleSmsController extends Controller
{
    public function __construct(
        protected SingleSmsService $singleSmsService
    ) {}

    public function index(Request $request)
    {
        $logs = CampaignLog::with(['subscriber', 'campaign'])
            ->where('user_id', $request->user()->id)
            ->orWhereHas('campaign', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->orWhereHas('subscriber', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('SingleSms/Index', [
            'logs' => $logs,
        ]);
    }

    public function create()
    {
        return Inertia::render('SingleSms/Create', [
            'senderIds' => SenderId::where('user_id', auth()->id())->where('status', 'approved')->get(),
        ]);
    }

    public function store(StoreSingleSmsRequest $request)
    {
        try {
            $result = $this->singleSmsService->sendSingleSms(
                $request->validated(),
                $request->user()
            );

            return redirect()->route('single-sms.index')->with('success', $result['message']);
        } catch (\Exception $e) {
            logger()->error($e->getMessage());
            return back()->with('error', $e->getMessage());
        }
    }

    public function searchSubscribers(Request $request)
    {
        $search = $request->input('query');

        $subscribers = $this->singleSmsService->searchSubscribers($search, $request->user());

        return response()->json($subscribers);
    }
}
