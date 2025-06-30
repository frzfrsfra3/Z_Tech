<?php

// app/Repository/ProjectRepository.php
namespace App\Repository;

use App\Abstract\BaseRepositoryImplementation;
use App\Interfaces\ProjectInterface;
use App\ApiHelper\ApiResponseHelper;
use App\ApiHelper\Result;
use App\ApiHelper\ErrorResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\InMemoryStorage;
use App\ApiHelper\ApiResponseCodes;

class ProjectRepository extends BaseRepositoryImplementation implements ProjectInterface
{
    public function model()
    {
        // Keep this but it won't be used for in-memory storage
        return \App\Models\Project::class;
    }
    private function checkApiKey(Request $request)
    {
        $apiKey = $request->header('X-API-KEY');
       
        if ($apiKey !== self::API_KEY) {
            abort(403, 'Unauthorized access');
        }
    }

    public function getProjectsForDropdown()
    {
        $projects = InMemoryStorage::getProjects();
        
        return ApiResponseHelper::sendResponse(
            new Result($projects, 'Projects fetched successfully')
        );
    }

    public function createProject(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'id' => 'required|string|unique:projects,id' // Still validate uniqueness
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

        // Check uniqueness manually for in-memory storage
        if (InMemoryStorage::findProject($request->input('id'))) {
            return ApiResponseHelper::sendErrorResponse(
                new ErrorResult(
                    ['id' => ['The id has already been taken.']],
                    'The id has already been taken.',
                    null,
                    false,
                    400
                ),
                400
            );
        }

        $project = [
            'id' => $request->input('id'),
            'name' => $request->input('name')
        ];

        InMemoryStorage::addProject($project);

        return ApiResponseHelper::sendResponse(
            new Result($project, 'Project created successfully')
        );
    }
}