<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // subscription, extra_sms, renewal
            $table->decimal('amount', 10, 2);
            $table->text('description');
            $table->string('status')->default('pending'); // pending, completed, failed
            $table->string('payment_method'); // card, wallet, bank_transfer
            $table->string('reference')->unique();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
