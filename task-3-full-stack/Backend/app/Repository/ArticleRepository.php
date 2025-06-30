<?php

namespace App\Repository;

use App\Abstract\BaseRepositoryImplementation;
use App\Models\Article;
use App\Models\ArticleVisibilityDay;
use App\Models\Rating;
use App\Interfaces\ArticleInterface;
use App\ApiHelper\ApiResponseCodes;
use App\ApiHelper\ApiResponseHelper;
use App\ApiHelper\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\ApiHelper\ErrorResult;
use Carbon\Carbon;

class ArticleRepository extends BaseRepositoryImplementation implements ArticleInterface
{
    public function model()
    {
        return Article::class;
    }

    public function createArticle(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'content' => 'required|string',
            'visible_days' => 'required|array|min:1',
            'visible_days.*' => 'integer|between:0,6',
        ]);

        if ($validator->fails()) {
            return ApiResponseHelper::validationError(
                $validator->errors(),
                $validator->errors()->first()
            );
        }

        $data = $validator->validated();
        $data['author_id'] = Auth::id();

        $article = $this->model->with(['visibilityDays', 'ratings'])->create($data);
        $article->load(['author','visibilityDays', 'ratings']);
        foreach ($data['visible_days'] as $day) {
            ArticleVisibilityDay::create([
                'article_id' => $article->id,
                'day_of_week' => $day,
            ]);
        }

        return ApiResponseHelper::sendResponse(new Result($article, 'Article created successfully'));
    }

    public function updateArticle(Request $request, $id)
    {
        $article =$this->model->findOrFail($id);
    
        if ($article->author_id !== Auth::id()) {
            return ApiResponseHelper::error(
                'Unauthorized',
                ApiResponseCodes::UNAUTHORIZED,
                null,
                403
            );
        }
    
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string',
            'content' => 'sometimes|required|string',
            'visible_days' => 'sometimes|array|min:1',
            'visible_days.*' => 'integer|between:0,6',
        ]);
    
        if ($validator->fails()) {
            return ApiResponseHelper::validationError(
                $validator->errors(),
                $validator->errors()->first()
            );
        }
    
        $data = $validator->validated();
    
        if (!empty($data)) {
            $article->update($data);
        }
    
        if (isset($data['visible_days'])) {
            ArticleVisibilityDay::where('article_id', $article->id)->delete();
            foreach ($data['visible_days'] as $day) {
                ArticleVisibilityDay::create([
                    'article_id' => $article->id,
                    'day_of_week' => $day,
                ]);
            }
        }
    
        $article->load(['author', 'visibilityDays', 'ratings']);
    
        return ApiResponseHelper::sendResponse(new Result($article, 'Article updated successfully'));
    }
    

    public function deleteArticle($id)
    {
        $article = $this->model->findOrFail($id);

        if ($article->author_id !== Auth::id()) {
            return ApiResponseHelper::error(
                'Unauthorized',
                ApiResponseCodes::UNAUTHORIZED,
                null,
                403
            );
        }

        $article->delete();

        return ApiResponseHelper::success(null, 'Article deleted successfully');
    }

    public function getArticle($id)
    {
        $article = $this->model->with('ratings')->findOrFail($id);
        $article->average_rating = $article->ratings()->avg('rating');

        return ApiResponseHelper::sendResponse(new Result($article, 'Article retrieved'));
    }

    public function getMyArticles()
    {
        $articles = Auth::user()->articles()->with('visibilityDays')->get();
        return ApiResponseHelper::sendResponse(new Result($articles, 'My articles retrieved'));
    }

    public function getVisibleTodayArticles($request = null)
    {
        $today = Carbon::now()->dayOfWeek;
        
        $query = $this->model->whereHas('visibilityDays', fn ($q) =>
            $q->where('day_of_week', $today)
        )->with(['author', 'ratings']);
    
        if ($request && $request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                  ->orWhere('content', 'like', '%'.$request->search.'%');
            });
        }
    
        $articles = $query->get();
        
        return ApiResponseHelper::sendResponse(new Result($articles, 'Articles visible today retrieved'));
    }

    public function rateArticle(Request $request, $id)
    {
        $article = $this->model->findOrFail($id);

        if ($article->author_id === Auth::id()) {
            return ApiResponseHelper::error(
                'You cannot rate your own article',
                ApiResponseCodes::INVALID_REQUEST,
                null,
                403
            );
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|between:1,5'
        ]);

        if ($validator->fails()) {
            return ApiResponseHelper::validationError(
                $validator->errors(),
                $validator->errors()->first()
            );
        }

        $rating = Rating::updateOrCreate(
            ['user_id' => Auth::id(), 'article_id' => $id],
            ['rating' => $request->rating]
        );

        return ApiResponseHelper::sendResponse(new Result($rating, 'Rating submitted successfully'));
    }
}
