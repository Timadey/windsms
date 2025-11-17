<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sender_ids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('sender_id', 11); // Max 11 characters for sender ID
            $table->text('purpose')->nullable(); // Why they need this sender ID
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();

            // Unique constraint: one user can't have duplicate sender IDs
            $table->unique(['user_id', 'sender_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sender_ids');
    }
};
