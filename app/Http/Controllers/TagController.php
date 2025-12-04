<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Models\Tag;
use App\Services\TagService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(
        protected TagService $tagService
    ) {}

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

    public function store(StoreTagRequest $request)
    {
        try {
            $this->tagService->createTag($request->validated(), $request->user());
            return redirect()->back()->with('success', 'Tag created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateTagRequest $request, Tag $tag)
    {
        if ($tag->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->tagService->updateTag($tag, $request->validated());

        return redirect()->back()->with('success', 'Tag updated successfully.');
    }

    public function destroy(Request $request, Tag $tag)
    {
        if ($tag->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->tagService->deleteTag($tag);

        return redirect()->back()->with('success', 'Tag deleted successfully.');
    }
}
