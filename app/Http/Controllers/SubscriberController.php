<?php

namespace App\Http\Controllers;

use App\Jobs\ImportSubscribersJob;
use App\Models\Subscriber;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use League\Csv\Reader;

class SubscriberController extends Controller
{
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|min:11|max:11|string|unique:subscribers',
            'name' => 'nullable|string|max:255',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $subscriber = Subscriber::create([
            'user_id' => $request->user()->id,
            'phone_number' => formatPhoneNumber($validated['phone_number']),
            'name' => $validated['name'] ?? null,
        ]);

        if (!empty($validated['tag_ids'])) {
            $subscriber->tags()->sync($validated['tag_ids']);
        }

        return redirect()->back()->with('success', 'Subscriber added successfully.');
    }

    public function update(Request $request, Subscriber $subscriber)
    {
        if ($subscriber->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'phone_number' => 'required|string',
            'name' => 'nullable|string|max:255',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $subscriber->update([
            'phone_number' => formatPhoneNumber($validated['phone_number']),
            'name' => $validated['name'] ?? null,
        ]);

        if (isset($validated['tag_ids'])) {
            $subscriber->tags()->sync($validated['tag_ids']);
        }

        return redirect()->back()->with('success', 'Subscriber updated successfully.');
    }

    public function destroy(Request $request, Subscriber $subscriber)
    {
        if ($subscriber->user_id !== $request->user()->id) {
            abort(403);
        }

        $subscriber->delete();

        return redirect()->back()->with('success', 'Subscriber deleted successfully.');
    }

    public function bulkImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $file = $request->file('file');

        try {
            // Read and validate CSV
            $csv = Reader::createFromPath($file->getRealPath(), 'r');
            $csv->setHeaderOffset(0);

            // Get headers
            $headers = $csv->getHeader();

            // Validate that required column exists
            $hasPhoneNumber = in_array('phone_number', $headers);
            $hasPhone = in_array('phone', $headers);

            if (!$hasPhoneNumber && !$hasPhone) {
                return redirect()->back()->withErrors([
                    'file' => 'CSV file must contain either "phone_number" or "phone" column header.'
                ]);
            }

            // Count records
            $records = iterator_to_array($csv->getRecords());
            $totalRecords = count($records);

            if ($totalRecords === 0) {
                return redirect()->back()->withErrors([
                    'file' => 'CSV file is empty or contains no valid records.'
                ]);
            }

            // For large files (>500 records), process in background
            if ($totalRecords > 5) {
                // Store file temporarily
                $filename = 'imports/' . uniqid() . '_' . $file->getClientOriginalName();
                Storage::put($filename, file_get_contents($file->getRealPath()));

                // Dispatch job
                ImportSubscribersJob::dispatch(
                    $request->user()->id,
                    $filename,
                    $request->tag_ids ?? []
                );

                return redirect()->back()->with('success',
                    "Your import of {$totalRecords} subscribers has been queued and will be processed in the background. You'll receive a notification when it's complete."
                );
            }

            // For smaller files, process immediately
            $imported = 0;
            $skipped = 0;
            $errors = [];

            foreach ($records as $index => $record) {
                try {
                    // Get phone number from either column
                    $phoneNumber = $record['phone_number'] ?? $record['phone'] ?? null;

                    if (empty($phoneNumber)) {
                        $skipped++;
                        continue;
                    }

                    // Clean phone number (remove spaces, dashes, etc.)
                    $phoneNumber = formatPhoneNumber($phoneNumber);

                    if (empty($phoneNumber)) {
                        $skipped++;
                        continue;
                    }

                    $subscriber = Subscriber::firstOrCreate(
                        [
                            'user_id' => $request->user()->id,
                            'phone_number' => $phoneNumber,
                        ]
                    );

                    if (!empty($request->tag_ids)) {
                        $subscriber->tags()->syncWithoutDetaching($request->tag_ids);
                    }

                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
                }
            }

            $message = "{$imported} subscribers imported successfully.";
            if ($skipped > 0) {
                $message .= " {$skipped} rows skipped (empty phone numbers).";
            }
            if (!empty($errors) && count($errors) <= 10) {
                $message .= " Errors: " . implode(', ', $errors);
            } elseif (!empty($errors)) {
                $message .= " " . count($errors) . " errors occurred.";
            }

            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            return redirect()->back()->with('error','Error processing CSV file: ' . $e->getMessage());
        }
    }
}
