<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Carbon;

class Article extends Model
{
    protected $with = ['author', 'visibilityDays', 'ratings'];
    protected $appends = ['average_rating'];
    protected $fillable= ['title','content','author_id'];
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function visibilityDays()
    {
        return $this->hasMany(ArticleVisibilityDay::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function getAverageRatingAttribute()
    {
        return $this->ratings()->avg('rating');
    }

    public function scopeVisibleToday($query)
    {
        return $query->whereHas('visibilityDays', function($q) {
            $q->where('day_of_week', Carbon::now()->dayOfWeek);
        });
    }

    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }
}