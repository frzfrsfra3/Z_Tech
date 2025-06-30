<?php
namespace App\Actions\Article;

use App\Repository\ArticleRepository;

class MyPostsAction
{
    protected ArticleRepository $repository;

    public function __construct(ArticleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke()
    {
        return $this->repository->getMyArticles();
    }
}