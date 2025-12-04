<?php

namespace App\Http\Requests;

use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'message' => 'required|string|max:160',
            'spintax_message' => 'nullable|string',
            'sender_id' => ['nullable', Rule::exists('sender_ids')->where(function (Builder $query) {
                $query->where('user_id', $this->user()->id);
            })],
            'recipient_type' => 'required|in:tags,manual',
            'tag_ids' => 'required_if:recipient_type,tags|nullable|array|min:1',
            'tag_ids.*' => 'exists:tags,id',
            'phone_numbers' => 'required_if:recipient_type,manual|nullable|array|min:1|max:300|distinct',
            'phone_numbers.*' => ['regex:/^(0)(7|8|9)(0|1)\d{8}$/'],
            'dispatch_at' => 'nullable|date|after:now',
            'dispatch_now' => 'boolean',
            'is_recurring' => 'boolean',
            'recurrence_type' => 'nullable|in:daily,weekly,monthly,custom',
            'recurrence_interval' => 'nullable|integer|min:1|max:365',
            'recurrence_end_date' => 'nullable|date|after:now',
        ];
    }

    public function messages(): array
    {
        return [
            'tag_ids.required_if' => 'Please select at least one tag.',
            'phone_numbers.required_if' => 'Please provide at least one valid phone number.',
            'phone_numbers.max' => 'Max number for manual method is :max, consider using the tagged option to send to thousands of numbers',
            'phone_numbers.*.regex' => 'Please provide a valid Nigerian phone number in local format e.g. 07012345678..',
        ];
    }
}
