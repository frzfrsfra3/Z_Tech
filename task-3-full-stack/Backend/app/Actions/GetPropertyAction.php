<?php
namespace App\Actions;

use App\Repository\PropertyRepository;
use Illuminate\Http\Request;

class GetPropertyAction 
{
    protected $propertyRepository;

    public function __construct(PropertyRepository $propertyRepository) 
    {
        $this->propertyRepository = $propertyRepository;
    }

    public function __invoke(Request $request)
    {
        return $this->propertyRepository->getProperties($request);
    }
}