<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone_number' => 'required|array',
            'phone_number.*' => 'required|min:11|max:11|string|distinct',
            'name' => 'nullable|string|max:255',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ];
    }
}
