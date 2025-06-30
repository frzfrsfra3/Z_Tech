<?php 
// app/Services/InMemoryStorage.php
namespace App\Services;

class InMemoryStorage
{
    private static $storage = [
        'projects' => [
            ['id' => 'proj_1', 'name' => 'Downtown Towers'],
            ['id' => 'proj_2', 'name' => 'Marina Residences']
        ],
        'properties' => []
    ];

    public static function getProjects(): array
    {
        return self::$storage['projects'];
    }

    public static function addProject(array $project): array
    {
        self::$storage['projects'][] = $project;
        return $project;
    }

    public static function getProperties(): array
    {
        return self::$storage['properties'];
    }

    public static function addProperty(array $property): array
    {
        self::$storage['properties'][] = $property;
        return $property;
    }

    public static function findProject(string $id): ?array
    {
        foreach (self::$storage['projects'] as $project) {
            if ($project['id'] === $id) {
                return $project;
            }
        }
        return null;
    }
}