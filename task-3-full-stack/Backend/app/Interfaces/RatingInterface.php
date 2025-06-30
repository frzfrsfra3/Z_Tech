<?php
namespace App\Interfaces;
use Illuminate\Http\Request;
interface RatingInterface extends BaseRepositoryInterface
{
    // Additional methods for the Rating repository
    public function createRating(Request $request);
}