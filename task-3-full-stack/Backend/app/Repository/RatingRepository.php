<?php
namespace App\Repository;

use App\Abstract\BaseRepositoryImplementation;
use App\Models\Rating;
use App\Interfaces\RatingInterface;
use App\ApiHelper\ApiResponseCodes;
use App\ApiHelper\ApiResponseHelper;
use App\ApiHelper\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\ApiHelper\ErrorResult;
class RatingRepository extends BaseRepositoryImplementation implements RatingInterface
{
    public function model()
    {
        return Rating::class;
    }

    // Implement any additional methods here
  public function createRating(Request $request)
{
    // dd($request);
    $startTime = microtime(true);
    $rules = [
        'name'=>'required',
        'feedback'=>'required',
        'stars'=>'numeric'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
        // Extract the first validation message
        $firstErrorMessage = $validator->errors()->first();

        return ApiResponseHelper::sendErrorResponse(
            new ErrorResult(
                $validator->errors(),
                $firstErrorMessage, // Use the first validation message here
                null,
                false,
                400
            ),
            400
        );
    }

    $r = $this->create($validator->validated());

    return ApiResponseHelper::sendResponse(new Result($r, 'Rating created successfully'));
}
}