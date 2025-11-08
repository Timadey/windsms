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
        'spintax_message',
        'tag_ids',
        'dispatch_at',
        'status',
        'total_recipients',
        'sent_count',
        'failed_count',
        'completed_at',
        'pending_count',
    ];

    protected $casts = [
        'tag_ids' => 'array',
        'dispatch_at' => 'datetime',
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
