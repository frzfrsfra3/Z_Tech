<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeRepo extends Command
{
    protected $signature = 'make:repo {name}';

    protected $description = 'Create a new repository, interface, model, and migration';

    public function handle()
    {
        $name = $this->argument('name');
        $repoPath = app_path("Repositories/{$name}Repository.php");
        $interfacePath = app_path("Interfaces/{$name}Interface.php");
        $baseInterfacePath = app_path("Interfaces/{$name}Interface.php");

        // Generate the model and migration
        $this->call('make:model', ['name' => $name, '--migration' => true]);

        // Create the Repositories and Interfaces directories if they don't exist
        if (! File::exists(app_path('Repositories'))) {
            File::makeDirectory(app_path('Repositories'));
        }

        if (! File::exists(app_path('Interfaces'))) {
            File::makeDirectory(app_path('Interfaces'));
        }

        // Check if the BaseRepositoryInterface exists and create it if it doesn't
        if (! File::exists($baseInterfacePath)) {
            $baseInterfaceTemplate = <<<EOT
            namespace App\Interfaces;

            interface {$name}Interface
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
            $this->info('BaseRepositoryInterface created successfully!');
        }

        // Create the interface file
        $interfaceTemplate = <<<EOT
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
        namespace App\Repositories;

        use App\Abstract\BaseRepositoryImplementation;
        use App\Models\\$name;
        use App\Interfaces\\{$name}Interface;

        class {$name}Repository extends BaseRepositoryImplementation implements {$name}Interface
        {
            public function model()
            {
                return $name::class;
            }

            // Implement any additional methods here
        }
        EOT;

        File::put($repoPath, $repoTemplate);
        $this->info("Repository {$name}Repository created successfully!");
    }
}
