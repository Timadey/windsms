<?php

namespace App\Http\Controllers;

use App\Jobs\SendCampaignSms;
use App\Models\Campaign;
use App\Models\SenderId;
use App\Models\Subscriber;
use App\Models\Tag;
use App\Services\Ai\AiServiceManager;
use App\Shared\Enums\FeaturesEnum;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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

        $senderIds = SenderId::where('user_id', $request->user()->id)
            ->approved()
            ->get();


        return Inertia::render('Campaigns/Create', [
            'tags' => $tags,
            'senderIds' => $senderIds,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string|max:150',
            'spintax_message' => 'nullable|string',
            'sender_id' => ['nullable', Rule::exists('sender_ids')->where(function (Builder $query) use($request) {
                $query->where('user_id', $request->user()->id);
            })],
            'recipient_type' => 'required|in:tags,manual',
            'tag_ids' => 'required_if:recipient_type,tags|nullable|array|min:1',
            'tag_ids.*' => 'exists:tags,id',
            'phone_numbers' => 'required_if:recipient_type,manual|nullable|array|min:1|max:300|distinct',
            'phone_numbers.*' => ['regex:/^(0)(7|8|9)(0|1)\d{8}$/'],
            'dispatch_at' => 'nullable|date|after:now',
            'dispatch_now' => 'boolean',
            'is_recurring' => 'boolean',
            'recurrence_type' => 'nullable|in:daily,weekly,monthly,custom',
            'recurrence_interval' => 'nullable|integer|min:1|max:365',
            'recurrence_end_date' => 'nullable|date|after:now',
        ], [
            'tag_ids.required_if' => 'Please select at least one tag.',
            'phone_numbers.required_if' => 'Please provide at least one valid phone number.',
            'phone_numbers.max' => 'Max number for manual method is :max, consider using the tagged option to send to thousands of numbers',
            'phone_numbers.*.regex' => 'Please provide a valid Nigerian phone number in local format e.g. 07012345678..',
        ]);

        // Count total recipients based on type
        $totalRecipients = 0;

        if ($validated['recipient_type'] === 'tags') {
            // Count unique subscribers from selected tags
            $totalRecipients = Subscriber::where('user_id', $request->user()->id)
                ->whereHas('tags', function ($q) use ($validated) {
                    $q->whereIn('tags.id', $validated['tag_ids']);
                })
                ->distinct()
                ->count();
        } else {
            // Count unique phone numbers from manual input
            $phoneNumbers = $validated['phone_numbers'];
            $totalRecipients = count($phoneNumbers);

            // Validate that we have at least one valid phone number
            if ($totalRecipients === 0) {
                return back()->withErrors(['phone_numbers' => 'Please provide at least one valid phone number.']);
            }
        }

        // Determine dispatch time with allowed hours enforcement (8am - 8pm WAT)
        $dispatchTime = $this->getValidDispatchTime($validated);

        // Calculate next run time for recurring campaigns
        $nextRunAt = null;
        if ($validated['is_recurring'] ?? false) {
            $nextRunAt = $this->calculateNextRun(
                $dispatchTime,
                $validated['recurrence_type'],
                $validated['recurrence_interval'] ?? null
            );
        }

        // Determine campaign status
        $status = $this->determineCampaignStatus($validated, $dispatchTime);
        $user = $request->user();

        // check if user has enought sms balance to cater for this campaign
        $subscription = $user->subscription;
        if (!$subscription || $subscription->expired()) {
            return back()->with('error', 'Subscribe to a plan to start sending campaigns.');
        }
        $totalRequiredBalance = $this->determineCampaignRequiredBalance($totalRecipients, $validated['message']);
        // validate that the user has enough balance
        if ($user->cantConsume('sms-units', $totalRequiredBalance))
        {
            return back()->with('error', 'You do not have sufficient sms units to run this campaign. Reduce your contact or buy more units');
        }
        // charge the user for the campaign
        $user->consume('sms-units', $totalRequiredBalance);

        $campaign = Campaign::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'message' => $validated['message'],
            'sender_id' => $validated['sender_id'] ?? 'Windsms',
            'spintax_message' => $validated['spintax_message'] ?? $validated['message'],
            'recipient_type' => $validated['recipient_type'],
            'tag_ids' => $validated['recipient_type'] === 'tags' ? $validated['tag_ids'] : null,
            'phone_numbers' => $validated['recipient_type'] === 'manual' ? $validated['phone_numbers'] : null,
            'dispatch_at' => $dispatchTime,
            'status' => $status,
            'total_recipients' => $totalRecipients,
            'is_recurring' => $validated['is_recurring'] ?? false,
            'recurrence_type' => $validated['recurrence_type'] ?? null,
            'recurrence_interval' => $validated['recurrence_interval'] ?? null,
            'recurrence_end_date' => $validated['recurrence_end_date'] ?? null,
            'next_run_at' => $nextRunAt,
        ]);

        // Dispatch immediately if within allowed hours, otherwise it will be picked up by scheduler
        if ($status === 'processing') {
            SendCampaignSms::dispatch($campaign);
        }

        $message = $this->getSuccessMessage($validated, $status, $dispatchTime);
        return redirect()->route('campaigns.index')->with('success', $message);
    }

    private function determineCampaignRequiredBalance(int $recipientCount, string $message)
    {
        // get the count of sms unit required
        $messageCount = mb_strlen($message) / 160;
        $smsUnitRequired = max(ceil($messageCount), 1);
        return $smsUnitRequired * $recipientCount;
    }

    /**
     * Get valid dispatch time enforcing 8am - 8pm WAT hours
     */
    private function getValidDispatchTime(array $validated): Carbon
    {
        $timezone = 'Africa/Lagos'; // WAT timezone

        // If dispatch_now is true or dispatch_at is not provided
        if ($validated['dispatch_now'] ?? false || empty($validated['dispatch_at'])) {
            $now = now($timezone);

            // Check if current time is within allowed hours (8am - 8pm)
            if ($this->isWithinAllowedHours($now)) {
                return $now;
            }

            // If outside allowed hours, schedule for next 8:30am
            return $this->getNextAllowedTime($now);
        }

        // Use provided dispatch_at time
        $dispatchAt = Carbon::parse($validated['dispatch_at'], $timezone);

        // Validate that the scheduled time is within allowed hours
        if (!$this->isWithinAllowedHours($dispatchAt)) {
            // If not, adjust to next allowed time
            return $this->getNextAllowedTime($dispatchAt);
        }

        return $dispatchAt;
    }

    /**
     * Check if time is within allowed hours (8am - 8pm WAT)
     */
    private function isWithinAllowedHours(Carbon $time): bool
    {
        $hour = $time->hour;
        return $hour >= 8 && $hour < 20; // 8am to 8pm (20:00)
    }

    /**
     * Get next allowed time (8:30am)
     */
    private function getNextAllowedTime(Carbon $time): Carbon
    {
        $nextTime = $time->copy();

        // If before 8am, schedule for 8:30am today
        if ($nextTime->hour < 8) {
            $nextTime->setTime(8, 30, 0);
        } else {
            // If after 8pm, schedule for 8:30am tomorrow
            $nextTime->addDay()->setTime(8, 30, 0);
        }

        return $nextTime;
    }

    /**
     * Determine campaign status based on dispatch time
     */
    private function determineCampaignStatus(array $validated, Carbon $dispatchTime): string
    {
        // If dispatch_now was requested and time is within allowed hours
        if (($validated['dispatch_now'] ?? false) && $this->isWithinAllowedHours(now('Africa/Lagos'))) {
            return 'processing';
        }

        // If dispatch time is now or in the past and within allowed hours
        if ($dispatchTime->isNowOrPast()) {
            if ($this->isWithinAllowedHours($dispatchTime)) {
                return 'processing';
            }
        }

        return 'scheduled';
    }

    /**
     * Get success message based on campaign settings
     */
    private function getSuccessMessage(array $validated, string $status, Carbon $dispatchTime): string
    {
        $isRecurring = $validated['is_recurring'] ?? false;
        $timezone = 'Africa/Lagos';

        if ($isRecurring) {
            $baseMessage = 'Recurring campaign created successfully.';
        } else {
            $baseMessage = 'Campaign created successfully.';
        }

        // If scheduled for later, add dispatch time info
        if ($status === 'scheduled') {
            $formattedTime = $dispatchTime->timezone($timezone)->format('M j, Y \a\t g:i A');
            $baseMessage .= " Scheduled for dispatch at {$formattedTime} WAT.";
        } elseif ($validated['dispatch_now'] ?? false) {
            // If user requested immediate but was rescheduled
            if (!$this->isWithinAllowedHours(now($timezone))) {
                $formattedTime = $dispatchTime->timezone($timezone)->format('M j, Y \a\t g:i A');
                $baseMessage .= " SMS can only be sent between 8:00 AM - 8:00 PM WAT. Scheduled for {$formattedTime} WAT.";
            }
        }

        return $baseMessage;
    }

    /**
     * Calculate next run time based on recurrence type
     */
    protected function calculateNextRun($baseTime, $type, $interval = null)
    {
        $carbon = Carbon::parse($baseTime);

        return match ($type) {
            'daily' => $carbon->addDay(),
            'weekly' => $carbon->addWeek(),
            'monthly' => $carbon->addMonth(),
            'custom' => $carbon->addDays($interval ?? 1),
            default => null,
        };
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

    public function generateSpintax(Request $request, AiServiceManager $aiService)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        // check if user can consume ai mixture
        $user = $request->user();
        if ($user->cantConsume(FeaturesEnum::mixer->value, 1))
        {
            return response()->json(['error' => 'You do not have enough credits to use this feature.']);
        }

        $spintax = $aiService->generateSpintax($validated['message']);
        // $overview = $aiService->spintaxOverview($spintax, 100);

        // if spintax was generated
        if (!empty($spintax)) {
            // charge the user
            $user->consume(FeaturesEnum::mixer->value, 1);
        }
        logger()->debug("Debug spintax: sending response now");

        return response()->json([
            'spintax' => $spintax,
            // 'overview' => $overview,
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
