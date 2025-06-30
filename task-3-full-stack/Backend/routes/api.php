<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Actions\CreateRatingAction;
use App\Actions\Auth\LoginAction;
use App\Actions\Auth\RegisterAction;
use App\Actions\Auth\LogoutAction;
use App\Actions\Article\CreateArticleAction;
use App\Actions\Article\UpdateArticleAction;
use App\Actions\Article\DeleteArticleAction;
use App\Actions\Article\ShowArticleAction;
use App\Actions\Article\MyPostsAction;
use App\Actions\Article\VisibleTodayAction;
use App\Actions\Article\RateArticleAction;
use App\Actions\CreatePropertyAction;
use App\Actions\GetPropertyAction;
use App\Actions\GetProjectsAction;
/*th
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/ratings', CreateRatingAction::class);

Route::post('/register', RegisterAction::class)->name('register');
Route::post('/login', LoginAction::class)->name('login');
Route::get('/articles/{id}', ShowArticleAction::class);
Route::post('/logout', LogoutAction::class)->middleware('auth:api')->name('logout');
Route::get('/posts', VisibleTodayAction::class);
Route::middleware('auth:api')->group(function () {
    Route::get('/my-posts', MyPostsAction::class);
 

    Route::post('/articles', CreateArticleAction::class);
   
    Route::put('/articles/{id}', UpdateArticleAction::class);
    Route::delete('/articles/{id}', DeleteArticleAction::class);
    
    Route::post('/articles/{id}/rate', RateArticleAction::class);
});

Route::get('/projects', GetProjectsAction::class);
Route::post('/properties', CreatePropertyAction::class);
Route::get('/properties', GetPropertyAction::class);