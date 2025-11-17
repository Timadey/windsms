<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->json('phone_numbers')->nullable()->after('tag_ids');
            $table->enum('recipient_type', ['tags', 'manual'])->default('tags')->after('phone_numbers');
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['phone_numbers', 'recipient_type']);
        });
    }
};
