<?php

namespace App\Services;

use App\Models\Tag;
use App\Models\User;
use App\Shared\Enums\FeaturesEnum;

class TagService
{
    /**
     * Create a new tag
     */
    public function createTag(array $data, User $user): Tag
    {
        if ($user->cantConsume(FeaturesEnum::tags->value, 1)) {
            throw new \Exception('You do not have enough credits to add a new tag.');
        }

        $user->consume(FeaturesEnum::tags->value, 1);

        return Tag::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'color' => $data['color'] ?? '#3b82f6',
        ]);
    }

    /**
     * Update a tag
     */
    public function updateTag(Tag $tag, array $data): Tag
    {
        $tag->update($data);
        return $tag;
    }

    /**
     * Delete a tag
     */
    public function deleteTag(Tag $tag): void
    {
        $tag->delete();
    }
}
