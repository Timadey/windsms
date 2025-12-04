<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSingleSmsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sender_id' => 'nullable|exists:sender_ids,sender_id',
            'recipient_type' => 'required|in:manual,subscriber',
            'phone_number' => 'required_if:recipient_type,manual|nullable|string|min:11|max:11|regex:/^0[789][01]\d{8}$/',
            'subscriber_id' => 'required_if:recipient_type,subscriber|nullable|exists:subscribers,id',
            'message' => 'required|string',
        ];
    }
}
