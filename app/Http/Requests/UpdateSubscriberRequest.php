<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone_number' => 'required|string',
            'name' => 'nullable|string|max:255',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ];
    }
}
