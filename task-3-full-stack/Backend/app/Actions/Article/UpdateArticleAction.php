<?php
namespace App\Actions\Article;

use App\Repository\ArticleRepository;
use Illuminate\Http\Request;

class UpdateArticleAction
{
    protected ArticleRepository $repository;

    public function __construct(ArticleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(Request $request, $id)
    {
        return $this->repository->updateArticle($request, $id);
    }
}
