<?php
namespace App\Repository;

use App\Abstract\BaseRepositoryImplementation;
use App\Models\Project;
use App\Interfaces\ProjectInterface;
use App\ApiHelper\ApiResponseCodes;
use App\ApiHelper\ApiResponseHelper;
use App\ApiHelper\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\ApiHelper\ErrorResult;

class ProjectRepository extends BaseRepositoryImplementation implements ProjectInterface
{
    public function model()
    {
        return Project::class;
    }

    public function getProjectsForDropdown()
    {
        // Hardcoded projects as per requirements
        $projects = [
            ['id' => 'proj_1', 'name' => 'Downtown Towers'],
            ['id' => 'proj_2', 'name' => 'Marina Residences']
        ];
        
        return ApiResponseHelper::sendResponse(
            new Result($projects, 'Projects fetched successfully')
        );
    }

    public function createProject(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'id' => 'required|string|unique:projects,id'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $firstErrorMessage = $validator->errors()->first();
            return ApiResponseHelper::sendErrorResponse(
                new ErrorResult(
                    $validator->errors(),
                    $firstErrorMessage,
                    null,
                    false,
                    400
                ),
                400
            );
        }

        $project = $this->create($validator->validated());
        return ApiResponseHelper::sendResponse(
            new Result($project, 'Project created successfully')
        );
    }
}