<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArticleVisibilityDaysTableSeeder extends Seeder
{
    public function run()
    {
        $days = [
            ['article_id' => 1, 'day_of_week' => 1], // Monday
            ['article_id' => 1, 'day_of_week' => 3], // Wednesday
            ['article_id' => 1, 'day_of_week' => 5], // Friday
            ['article_id' => 2, 'day_of_week' => 0], // Sunday
            ['article_id' => 2, 'day_of_week' => 6], // Saturday
            ['article_id' => 3, 'day_of_week' => 2], // Tuesday
            ['article_id' => 3, 'day_of_week' => 4], // Thursday
        ];

        foreach ($days as $day) {
            DB::table('article_visibility_days')->insert([
                'article_id' => $day['article_id'],
                'day_of_week' => $day['day_of_week'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}