<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaign_logs', function (Blueprint $table) {
            $table->string('phone_number')->nullable()->after('subscriber_id');
            // Make subscriber_id nullable since we might not have a subscriber
            $table->unsignedBigInteger('subscriber_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('campaign_logs', function (Blueprint $table) {
            $table->dropColumn('phone_number');
        });
    }
};
