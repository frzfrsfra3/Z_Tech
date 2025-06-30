<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RatingsTableSeeder extends Seeder
{
    public function run()
    {
        $ratings = [
            ['article_id' => 1, 'user_id' => 2, 'rating' => 4],
            ['article_id' => 1, 'user_id' => 3, 'rating' => 5],
            ['article_id' => 2, 'user_id' => 1, 'rating' => 3],
            ['article_id' => 3, 'user_id' => 2, 'rating' => 5],
        ];

        foreach ($ratings as $rating) {
            DB::table('ratings')->insert([
                'article_id' => $rating['article_id'],
                'user_id' => $rating['user_id'],
                'rating' => $rating['rating'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}