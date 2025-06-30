<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleVisibilityDay extends Model
{
    use HasFactory;
    protected $fillable = ['article_id', 'day_of_week'];
}
