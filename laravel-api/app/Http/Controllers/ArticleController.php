<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleCollection;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Display a paginated list of articles.
     * 
     * GET /api/articles
     */
    public function index(): JsonResponse
    {
        $articles = Article::latestFirst()->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Articles retrieved successfully',
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    /**
     * Store a newly created article.
     * 
     * POST /api/articles
     */
    public function store(StoreArticleRequest $request): JsonResponse
    {
        $article = Article::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Article created successfully',
            'data' => new ArticleResource($article),
        ], 201);
    }

    /**
     * Display the specified article.
     * 
     * GET /api/articles/{id}
     */
    public function show(Article $article): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Article retrieved successfully',
            'data' => new ArticleResource($article),
        ]);
    }

    /**
     * Update the specified article.
     * 
     * PUT/PATCH /api/articles/{id}
     */
    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        $article->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully',
            'data' => new ArticleResource($article->fresh()),
        ]);
    }

    /**
     * Remove the specified article.
     * 
     * DELETE /api/articles/{id}
     */
    public function destroy(Article $article): JsonResponse
    {
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully',
            'data' => null,
        ]);
    }
}
