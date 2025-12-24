<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates the articles table with all required fields for storing
     * scraped blog articles from BeyondChats.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');
            $table->string('original_url')->unique();
            $table->timestamp('published_at')->nullable();
            $table->string('author')->nullable();
            $table->boolean('is_updated')->default(false);
            $table->longText('optimized_content')->nullable();
            $table->json('references')->nullable();
            $table->timestamps();

            // Indexes for query optimization
            $table->index('published_at');
            $table->index('is_updated');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
