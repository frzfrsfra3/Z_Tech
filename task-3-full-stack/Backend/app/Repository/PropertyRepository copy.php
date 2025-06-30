<?php
namespace App\Repository;

use App\Abstract\BaseRepositoryImplementation;
use App\Models\Property;
use App\Interfaces\PropertyInterface;
use App\ApiHelper\ApiResponseCodes;
use App\ApiHelper\ApiResponseHelper;
use App\ApiHelper\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\ApiHelper\ErrorResult;

class PropertyRepository extends BaseRepositoryImplementation implements PropertyInterface
{
    private const API_KEY = 'test123';
    public function model()
    {
        return Property::class;
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'data' => 'nullable|array'
        ]);
        if ($validator->fails()) {
            return ApiResponseHelper::validationError(
                $validator->errors(),
                $validator->errors()->first()
            );
        }


        // API Key validation
        if ($request->header('X-API-KEY') !== config('app.api_key')) {
        //    dd(config('app.api_key'));
            abort(403, 'Unauthorized access');
        }

        // $validator = Validator::make($request->all(), $rules);

        // if ($validator->fails()) {
        //     $firstErrorMessage = $validator->errors()->first();
        //     return ApiResponseHelper::sendErrorResponse(
        //         new ErrorResult(
        //             $validator->errors(),
        //             $firstErrorMessage,
        //             null,
        //             false,
        //             400
        //         ),
        //         400
        //     );
        // }

        // $property = $this->create($validator->validated());
        // return ApiResponseHelper::sendResponse(
        //     new Result($property, 'Property created successfully')
        // );
        return ApiResponseHelper::sendResponse(
            new Result(true, 'Property created successfully')
        );
    }
}