<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Shared\Enums\FeaturesEnum;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $tags = Tag::where('user_id', $request->user()->id)
            ->withCount('subscribers')
            ->latest()
            ->get();

        return Inertia::render('Tags/Index', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);
        // validate that the user can upload this number of tags
        $user = $request->user();
        if ($user->cantConsume(FeaturesEnum::tags->value, 1))
        {
            return back()->with('error', "You do not have enough credits to add a new tag.");
        }

        $user->consume(FeaturesEnum::tags->value, 1);

        Tag::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#3b82f6',
        ]);

        return redirect()->back()->with('success', 'Tag created successfully.');
    }

    public function update(Request $request, Tag $tag)
    {
        if ($tag->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $tag->update($validated);

        return redirect()->back()->with('success', 'Tag updated successfully.');
    }

    public function destroy(Request $request, Tag $tag)
    {
        if ($tag->user_id !== $request->user()->id) {
            abort(403);
        }

        $tag->delete();

        return redirect()->back()->with('success', 'Tag deleted successfully.');
    }
}
