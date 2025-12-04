<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkImportSubscribersRequest;
use App\Http\Requests\StoreSubscriberRequest;
use App\Http\Requests\UpdateSubscriberRequest;
use App\Models\Subscriber;
use App\Models\Tag;
use App\Services\SubscriberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriberController extends Controller
{
    public function __construct(
        protected SubscriberService $subscriberService
    ) {}

    public function index(Request $request)
    {
        $subscribers = Subscriber::where('user_id', $request->user()->id)
            ->with('tags')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('phone_number', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%");
                });
            })
            ->when($request->tag_id, function ($query, $tagId) {
                $query->whereHas('tags', function ($q) use ($tagId) {
                    $q->where('tags.id', $tagId);
                });
            })
            ->latest()
            ->paginate(20);

        $tags = Tag::where('user_id', $request->user()->id)->get();

        return Inertia::render('Subscribers/Index', [
            'subscribers' => $subscribers,
            'tags' => $tags,
            'filters' => $request->only(['search', 'tag_id']),
        ]);
    }

    public function store(StoreSubscriberRequest $request)
    {
        try {
            $this->subscriberService->createSubscribers(
                $request->validated()['phone_number'],
                $request->user(),
                $request->validated()['name'] ?? null,
                $request->validated()['tag_ids'] ?? null
            );

            return redirect()->back()->with('success', 'Subscriber added successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateSubscriberRequest $request, Subscriber $subscriber)
    {
        if ($subscriber->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $this->subscriberService->updateSubscriber($subscriber, $request->validated());
            return redirect()->back()->with('success', 'Subscriber updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Request $request, Subscriber $subscriber)
    {
        if ($subscriber->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->subscriberService->deleteSubscriber($subscriber);

        return redirect()->back()->with('success', 'Subscriber deleted successfully.');
    }

    public function bulkImport(BulkImportSubscribersRequest $request)
    {
        try {
            $result = $this->subscriberService->bulkImport(
                $request->file('file'),
                $request->user(),
                $request->validated()['tag_ids'] ?? null
            );

            if ($result['background']) {
                return redirect()->back()->with('success', $result['message']);
            }

            $message = "{$result['imported']} subscribers imported successfully.";
            if ($result['skipped'] > 0) {
                $message .= " {$result['skipped']} rows skipped (empty phone numbers).";
            }
            if (!empty($result['errors']) && count($result['errors']) <= 10) {
                $message .= " Errors: " . implode(', ', $result['errors']);
            } elseif (!empty($result['errors'])) {
                $message .= " " . count($result['errors']) . " errors occurred.";
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
