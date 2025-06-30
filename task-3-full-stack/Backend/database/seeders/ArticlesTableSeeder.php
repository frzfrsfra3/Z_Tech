<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArticlesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('articles')->insert([
            [
                'title' => 'Getting Started with Laravel',
                'content' => 'This is a comprehensive guide to Laravel basics...',
                'author_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Advanced Eloquent Techniques',
                'content' => 'Learn how to master Eloquent relationships...',
                'author_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Building APIs with Laravel',
                'content' => 'A complete tutorial on RESTful API development...',
                'author_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}