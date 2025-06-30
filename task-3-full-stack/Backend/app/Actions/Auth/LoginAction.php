<?php
namespace App\Actions\Auth;

use App\Repository\AuthRepository;
use Illuminate\Http\Request;

class LoginAction
{
    protected $authRepository;

    public function __construct(AuthRepository $authRepository) 
    {
        $this->authRepository = $authRepository;
    }

    public function __invoke(Request $request)
    {
        return $this->authRepository->login($request->all());
    }
}