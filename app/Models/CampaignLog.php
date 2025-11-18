<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignLog extends Model
{
    use HasFactory;
    protected $fillable = [
        'campaign_id',
        'subscriber_id',
        'phone_number', // New field
        'message_sent',
        'status',
        'error_message',
        'sent_at',
        'response_data',
        'retry_count',
        'next_retry_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'next_retry_at' => 'datetime',
        'response_data' => 'array',
    ];

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDueForRetry($query)
    {
        return $query->where('status', 'pending')
            ->where(function ($q) {
                $q->whereNull('next_retry_at')
                    ->orWhere('next_retry_at', '<=', now());
            });
    }

    public function scopeCanRetry($query, int $maxRetries = 5)
    {
        return $query->where('status', 'pending')
            ->where('retry_count', '<', $maxRetries);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(Subscriber::class);
    }

    /**
     * Get the display phone number (from subscriber or manual entry)
     */
    public function getDisplayPhoneNumberAttribute(): string
    {
        return $this->phone_number ?? $this->subscriber?->phone_number ?? 'Unknown';
    }

    public function getIsRetryableAttribute(): bool
    {
        return $this->status === 'pending' && $this->retry_count < 5;
    }

    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'sent' => '<span class="badge bg-success">Sent</span>',
            'pending' => '<span class="badge bg-warning">Pending</span>',
            'failed' => '<span class="badge bg-danger">Failed</span>',
            default => '<span class="badge bg-secondary">Unknown</span>',
        };
    }
}
