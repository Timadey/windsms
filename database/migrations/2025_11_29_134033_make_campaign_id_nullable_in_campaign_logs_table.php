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
            $table->foreignId('campaign_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaign_logs', function (Blueprint $table) {
            // We can't easily revert to non-nullable if there are null values,
            // but for strict reversal we would try.
            // For now, we'll just leave it or try to revert if possible.
            // $table->foreignId('campaign_id')->nullable(false)->change();
        });
    }
};
