<?php
namespace App\Actions;

use App\Repository\RatingRepository;
use Illuminate\Http\Request;

class CreateRatingAction 
{
    protected $RatingService;

    public function __construct(RatingRepository $RatingService) 
    {
        $this->RatingService = $RatingService;
    }

    public function __invoke(Request $request)
    {
        // Implement action functionality
        
          return $this->RatingService->createRating($request);
    
    }
}