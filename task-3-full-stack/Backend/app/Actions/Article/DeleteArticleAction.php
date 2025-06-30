<?php
namespace App\Actions\Article;

use App\Repository\ArticleRepository;

class DeleteArticleAction
{
    protected ArticleRepository $repository;

    public function __construct(ArticleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke($id)
    {
        return $this->repository->deleteArticle($id);
    }
}
