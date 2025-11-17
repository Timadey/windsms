<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'message',
        'sender_id',
        'spintax_message',
        'tag_ids',
        'phone_numbers', // New field
        'recipient_type', // New field
        'dispatch_at',
        'status',
        'total_recipients',
        'sent_count',
        'failed_count',
        'completed_at',
        'pending_count',
        'is_recurring',
        'recurrence_type',
        'recurrence_interval',
        'recurrence_end_date',
        'last_run_at',
        'next_run_at',
    ];

    protected $casts = [
        'tag_ids' => 'array',
        'dispatch_at' => 'datetime',
        'is_recurring' => 'boolean',
        'recurrence_end_date' => 'datetime',
        'last_run_at' => 'datetime',
        'next_run_at' => 'datetime',
        'completed_at' => 'datetime',
        'phone_numbers' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(CampaignLog::class);
    }

    public function campaignLogs(): HasMany
    {
        return $this->hasMany(CampaignLog::class);
    }
}
