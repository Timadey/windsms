<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkImportSubscribersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ];
    }
}
