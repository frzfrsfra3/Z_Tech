<?php
namespace App\Actions\Auth;

use App\Repository\AuthRepository;

class LogoutAction
{
    protected $authRepository;

    public function __construct(AuthRepository $authRepository) 
    {
        $this->authRepository = $authRepository;
    }

    public function __invoke()
    {
        return $this->authRepository->logout();
    }
}