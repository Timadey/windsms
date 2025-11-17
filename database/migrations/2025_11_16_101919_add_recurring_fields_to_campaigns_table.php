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
        Schema::table('campaigns', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(false)->after('status');
            $table->enum('recurrence_type', ['daily', 'weekly', 'monthly', 'custom'])->nullable()->after('is_recurring');
            $table->integer('recurrence_interval')->nullable()->comment('Interval in days for custom recurrence')->after('recurrence_type');
            $table->timestamp('recurrence_end_date')->nullable()->after('recurrence_interval');
            $table->timestamp('last_run_at')->nullable()->after('recurrence_end_date');
            $table->timestamp('next_run_at')->nullable()->after('last_run_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn([
                'is_recurring',
                'recurrence_type',
                'recurrence_interval',
                'recurrence_end_date',
                'last_run_at',
                'next_run_at',
            ]);
        });
    }
};
