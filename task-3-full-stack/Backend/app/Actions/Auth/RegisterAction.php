<?php
namespace App\Actions\Auth;

use App\Repository\AuthRepository;
use Illuminate\Http\Request;

class RegisterAction
{
    protected $authRepository;

    public function __construct(AuthRepository $authRepository) 
    {
        $this->authRepository = $authRepository;
    }

    public function __invoke(Request $request)
    {
        return $this->authRepository->register($request->all());
    }
}