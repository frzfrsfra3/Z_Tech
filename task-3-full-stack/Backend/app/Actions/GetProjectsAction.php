<?php
namespace App\Actions;

use App\Repository\ProjectRepository;
use Illuminate\Http\Request;

class GetProjectsAction 
{
    protected $ProjectService;

    public function __construct(ProjectRepository $ProjectService) 
    {
        $this->ProjectService = $ProjectService;
    }

    public function __invoke(Request $request)
    {
        // Implement action functionality
        //   return $this->ProjectService->createProject($data);
          return $this->ProjectService->getProjectsForDropdown();
    
    }
}