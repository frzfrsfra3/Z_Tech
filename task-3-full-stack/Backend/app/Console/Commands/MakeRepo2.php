<?php 
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeRepo2 extends Command
{
    protected $signature = 'make:repo2 {name} {--with-model}';
    protected $description = 'Create a new repository, interface, model, migration, and action';

    public function handle()
    {
        $name = $this->argument('name');
        $withModel = $this->option('with-model');
        $repoPath = app_path("Repository/{$name}Repository.php");
        $interfacePath = app_path("Interfaces/{$name}Interface.php");
        $baseInterfacePath = app_path("Interfaces/BaseRepositoryInterface.php");
        $actionPath = app_path("Actions/Create{$name}Action.php");

        // Generate the model and migration if --with-model is specified
        if ($withModel) {
            $this->call('make:model', ['name' => $name, '--migration' => true]);
        }

        // Create the Repositories and Interfaces directories if they don't exist
        if (!File::exists(app_path('Repository'))) {
            File::makeDirectory(app_path('Repository'));
        }

        if (!File::exists(app_path('Interfaces'))) {
            File::makeDirectory(app_path('Interfaces'));
        }

        if (!File::exists(app_path('Actions'))) {
            File::makeDirectory(app_path('Actions'));
        }

        // Check if the BaseRepositoryInterface exists and create it if it doesn't
        if (!File::exists($baseInterfacePath)) {
            $baseInterfaceTemplate = <<<EOT
            namespace App\Interfaces;

            interface BaseRepositoryInterface
            {
                public function all(array \$columns = ['*']);
                public function count();
                public function create(array \$data);
                public function updateOrCreate(array \$conditions, array \$data);
                public function createMultiple(array \$data);
                public function delete();
                public function deleteById(\$id);
                public function deleteMultipleById(array \$ids);
                public function first(array \$columns = ['*']);
                public function get(array \$columns = ['*']);
                public function getColumnValues(\$column);
                public function getById(\$id, array \$columns = ['*']);
                public function getFirstByColumn(\$item, \$column, array \$columns = ['*']);
                public function getAllByColumn(\$item, \$column, array \$columns = ['*']);
                public function getByColumn(\$item, \$column);
                public function paginate(\$limit = 25, array \$columns = ['*'], \$pageName = 'page', \$page = null);
                public function updateById(\$id, array \$data);
                public function updateByColumn(\$column_name, \$column_value, array \$data);
                public function limit(\$limit);
                public function orderBy(\$column, \$value);
                public function where(\$column, \$value, \$operator = '=');
                public function whereIn(\$column, \$value);
                public function with(\$relations);
                public function exists(\$attrs);
                public function insert(array \$data);
                public function updateByColumnWithNullableValues(\$column_name, \$column_value, array \$data);
                public function updateByIdWithNullableValues(\$id, array \$data);
                public function incrementDecrement(int \$id, string \$column_name, int \$value, bool \$isIncrement);
            }
            EOT;

            File::put($baseInterfacePath, $baseInterfaceTemplate);
            $this->info("BaseRepositoryInterface created successfully!");
        }

        // Create the interface file
        $interfaceTemplate = <<<EOT
        <?php
        namespace App\Interfaces;

        interface {$name}Interface extends BaseRepositoryInterface
        {
            // Additional methods for the {$name} repository
        }
        EOT;

        File::put($interfacePath, $interfaceTemplate);
        $this->info("Interface {$name}Interface created successfully!");

        // Create the repository file
        $repoTemplate = <<<EOT
        <?php
        namespace App\Repository;

        use App\Abstract\BaseRepositoryImplementation;
        use App\Models\\$name;
        use App\Interfaces\\{$name}Interface;
        use App\ApiHelper\ApiResponseCodes;
        use App\ApiHelper\ApiResponseHelper;
        use App\ApiHelper\Result;
        use Illuminate\Http\Request;
        use Illuminate\Support\Facades\Validator;
        use App\ApiHelper\ErrorResult;
        class {$name}Repository extends BaseRepositoryImplementation implements {$name}Interface
        {
            public function model()
            {
                return $name::class;
            }

            // Implement any additional methods here
          public function create{$name}(Request \$request)
        {
            \$startTime = microtime(true);
            \$rules = [
          
            ];

            \$validator = Validator::make(\$request->all(), \$rules);

            if (\$validator->fails()) {
                // Extract the first validation message
                \$firstErrorMessage = \$validator->errors()->first();

                return ApiResponseHelper::sendErrorResponse(
                    new ErrorResult(
                        \$validator->errors(),
                        \$firstErrorMessage, // Use the first validation message here
                        null,
                        false,
                        400
                    ),
                    400
                );
            }

            \$r = \$this->create(\$validator->validated());

            return ApiResponseHelper::sendResponse(new Result(\$r, '{$name} created successfully'));
        }
        }
        EOT;

        File::put($repoPath, $repoTemplate);
        $this->info("Repository {$name}Repository created successfully!");

        // Create the action file
        $actionTemplate = <<<EOT
        <?php
        namespace App\Actions;

        use App\Repository\\{$name}Repository;
        use Illuminate\Http\Request;

        class Create{$name}Action 
        {
            protected \${$name}Service;

            public function __construct({$name}Repository \${$name}Service) 
            {
                \$this->{$name}Service = \${$name}Service;
            }

            public function __invoke(Request \$request)
            {
                // Implement action functionality
                  return \$this->{$name}Service->create{$name}(\$data);
            
            }
        }
        EOT;

        File::put($actionPath, $actionTemplate);
        $this->info("Action Create{$name}Action created successfully!");
    }
}
