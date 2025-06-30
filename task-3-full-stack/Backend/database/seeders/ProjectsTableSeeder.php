<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class ProjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('projects')->insert([
            ['id' => 'proj_1', 'name' => 'Downtown Towers', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'proj_2', 'name' => 'Marina Residences', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
