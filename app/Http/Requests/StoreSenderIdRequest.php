<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSenderIdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sender_id' => [
                'required',
                'string',
                'max:11',
                'regex:/^[A-Za-z0-9 ]+$/', // Only alphanumeric
                'unique:sender_ids,sender_id,NULL,id,user_id,' . $this->user()->id,
            ],
            'purpose' => 'required|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'sender_id.regex' => 'Sender ID must contain only letters, numbers and decent spaces.',
            'sender_id.unique' => 'You have already applied for this sender ID.',
        ];
    }
}
