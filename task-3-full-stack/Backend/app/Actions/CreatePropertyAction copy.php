<?php
namespace App\Actions;

use App\Repository\PropertyRepository;
use Illuminate\Http\Request;

class CreatePropertyAction 
{
    protected $PropertyService;

    public function __construct(PropertyRepository $PropertyService) 
    {
        $this->PropertyService = $PropertyService;
    }

    public function __invoke(Request $request)
    {
        // Implement action functionality
          return $this->PropertyService->createProperty($data);
    
    }
}