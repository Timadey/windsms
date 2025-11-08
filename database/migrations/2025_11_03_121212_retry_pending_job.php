<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('campaign_logs', function (Blueprint $table) {
            $table->integer('retry_count')->default(0)->after('sent_at');
            $table->timestamp('next_retry_at')->nullable()->after('retry_count');

            // Add index for efficient querying of pending retries
            $table->index(['status', 'next_retry_at']);
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->integer('pending_count')->default(0)->after('failed_count');
            $table->string('sender_id')->nullable()->after('spintax_message');
            $table->timestamp('completed_at')->nullable()->after('dispatch_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaign_logs', function (Blueprint $table) {
            $table->dropIndex(['status', 'next_retry_at']);
            $table->dropColumn(['retry_count', 'next_retry_at']);
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['pending_count', 'sender_id', 'completed_at']);
        });
    }
};
