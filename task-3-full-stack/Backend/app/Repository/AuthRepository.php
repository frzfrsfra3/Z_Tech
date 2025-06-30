<?php
namespace App\Repository;

use App\Abstract\BaseRepositoryImplementation;
use App\Models\User;
use App\Interfaces\AuthRepositoryInterface;
use App\ApiHelper\ApiResponseHelper;
use App\ApiHelper\ApiResponseCodes;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthRepository extends BaseRepositoryImplementation implements AuthRepositoryInterface
{
    public function model()
    {
        return User::class;
    }

    public function login(array $credentials)
    {
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return ApiResponseHelper::validationError(
                $validator->errors(),
                $validator->errors()->first()
            );
        }

        if (!$token = JWTAuth::attempt($credentials)) {
            return ApiResponseHelper::error(
                'Invalid credentials',
                ApiResponseCodes::INVALID_CREDENTIALS,
                null,
                ApiResponseCodes::HTTP_UNAUTHORIZED
            );
        }

        return ApiResponseHelper::success([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => JWTAuth::user()
        ], 'Login successful');
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return ApiResponseHelper::success(null, 'Successfully logged out');
    }

    public function register(array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return ApiResponseHelper::validationError(
                $validator->errors(),
                $validator->errors()->first()
            );
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = JWTAuth::fromUser($user);

        return ApiResponseHelper::success([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => $user
        ], 'User registered successfully');
    }
}