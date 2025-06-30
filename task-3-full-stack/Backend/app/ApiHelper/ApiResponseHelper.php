<?php
namespace App\ApiHelper;

use Illuminate\Http\JsonResponse;

class ApiResponseHelper
{
    public static function success(
        $data = null, 
        string $message = 'Success', 
        int $httpCode = ApiResponseCodes::HTTP_SUCCESS
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'error_code' => null,
        ], $httpCode);
    }

    public static function created($data = null, string $message = 'Resource created'): JsonResponse 
    {
        return self::success($data, $message, ApiResponseCodes::HTTP_CREATED);
    }

    public static function error(
        string $message = 'Error',
        int $businessErrorCode = null,
        $errors = null,
        int $httpCode = ApiResponseCodes::HTTP_BAD_REQUEST
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error_code' => $businessErrorCode,
            'errors' => $errors,
        ], $httpCode);
    }

    public static function validationError(
        $errors, 
        string $message = 'Validation failed'
    ): JsonResponse {
        return self::error(
            $message,
            ApiResponseCodes::VALIDATION_ERROR,
            $errors,
            ApiResponseCodes::HTTP_BAD_REQUEST
        );
    }

    public static function unauthorized(string $message = 'Unauthorized'): JsonResponse 
    {
        return self::error(
            $message,
            ApiResponseCodes::INVALID_CREDENTIALS,
            null,
            ApiResponseCodes::HTTP_UNAUTHORIZED
        );
    }

    // Optional: Keep pagination helper if needed
    public static function paginated(
        $data,
        $pagination,
        string $message = 'Success'
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'pagination' => $pagination,
        ], ApiResponseCodes::HTTP_SUCCESS);
    }
    public static function sendSuccessResponse(SuccessResult $response)
    {
        return \Response::json([
            'success' => $response->isOk,
            'error_code' => null,
            'message' => $response->message,
            'data' => null,
            'paginate' => null,
        ], ApiResponseCodes::SUCCESS);
    }
    public static function sendResponse(Result $result, int $statusCode = ApiResponseCodes::SUCCESS)
    {
        return \Response::json([
            'success' => $result->isOk,
            'message' => $result->message,
            'data' => $result->result ?? null,
        ], $statusCode);
    }

}