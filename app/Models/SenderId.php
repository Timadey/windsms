<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SenderId extends Model
{
    protected $fillable = [
        'user_id',
        'sender_id',
        'purpose',
        'status',
        'rejection_reason',
        'approved_at',
        'rejected_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Accessors
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'approved' => 'green',
            'pending' => 'yellow',
            'rejected' => 'red',
            default => 'gray',
        };
    }

    public function getIsApprovedAttribute(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Methods
     */
    public function approve(): bool
    {
        return $this->update([
            'status' => 'approved',
            'approved_at' => now(),
            'rejection_reason' => null,
            'rejected_at' => null,
        ]);
    }

    public function reject(string $reason): bool
    {
        return $this->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason,
            'approved_at' => null,
        ]);
    }
}
