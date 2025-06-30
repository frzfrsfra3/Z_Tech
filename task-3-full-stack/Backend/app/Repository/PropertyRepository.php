<?php 
 // app/Repository/PropertyRepository.php
namespace App\Repository;

use App\Abstract\BaseRepositoryImplementation;
use App\Interfaces\PropertyInterface;
use App\ApiHelper\ApiResponseHelper;
use App\ApiHelper\Result;
use App\ApiHelper\ErrorResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\InMemoryStorage;
use App\ApiHelper\ApiResponseCodes;

class PropertyRepository extends BaseRepositoryImplementation implements PropertyInterface
{
    private const API_KEY = 'test123';

    public function model()
    {
        // Keep this but it won't be used
        return \App\Models\Property::class;
    }

    private function checkApiKey(Request $request)
    {
        $apiKey = $request->header('X-API-KEY');
       
        if ($apiKey !== self::API_KEY) {
            abort(403, 'Unauthorized access');
        }
    }

    public function createProperty(Request $request)
    {
        $this->checkApiKey($request);

        $validator = Validator::make($request->all(), [
            'project_id' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'data' => 'nullable|array',
            'price' => 'required|numeric|min:0',
            'size'=>'nullable | numeric',
            'handover_date' => 'required|date|after_or_equal:today'
        ]);

        if ($validator->fails()) {
            return ApiResponseHelper::validationError(
                $validator->errors(),
                $validator->errors()->first()
            );
        }

        // Verify project exists
        if (!InMemoryStorage::findProject($request->input('project_id'))) {
        
            return ApiResponseHelper::error(
                'Selected project does not exist',
                ApiResponseCodes::HTTP_BAD_REQUEST,
                null,
                400
            );
        }

        $property = [
            'id' => uniqid('prop_', true),
            'project_id' => $request->input('project_id'),
            'title' => $request->input('title'),
            'size' => $request->input('size'),
            'price' => $request->input('price'),
            'description' => $request->input('description'),
            'data' => $request->input('data', []),
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString()
        ];

        InMemoryStorage::addProperty($property);

        return ApiResponseHelper::sendResponse(
            new Result($property, 'Property created successfully')
        );
    }
    public function getProperties()
    {
        $projects = InMemoryStorage::getProperties();
        
        return ApiResponseHelper::sendResponse(
            new Result($projects, 'Properties fetched successfully')
        );
    }
}