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
            // Add unique constraint to prevent duplicate entries
            $table->unique(['campaign_id', 'subscriber_id'], 'campaign_subscriber_unique');

            // Add index for faster queries
            $table->index(['campaign_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaign_logs', function (Blueprint $table) {
            $table->dropUnique('campaign_subscriber_unique');
            $table->dropIndex(['campaign_id', 'status']);
        });
    }
};
