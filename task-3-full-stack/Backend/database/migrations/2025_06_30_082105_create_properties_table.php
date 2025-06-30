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
        Schema::create('properties', function (Blueprint $table) {
          
            $table->id();
            $table->string('project_id');
            $table->foreign('project_id')->references('id')->on('projects');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('attributes')->nullable(); // For any additional property data
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
