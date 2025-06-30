<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', // Custom string ID
        'name'
    ];

    public $incrementing = false; // Since we're using string IDs
    protected $keyType = 'string';

    public function properties()
    {
        return $this->hasMany(Property::class, 'project_id', 'id');
    }
}