<?php
namespace App\Actions\Article;

use App\Repository\ArticleRepository;
use Illuminate\Http\Request;

class CreateArticleAction 
{
    protected $ArticleService;

    public function __construct(ArticleRepository $ArticleService) 
    {
        $this->ArticleService = $ArticleService;
    }

    public function __invoke(Request $request)
    {
        // Implement action functionality
          return $this->ArticleService->createArticle($request);
    
    }
}