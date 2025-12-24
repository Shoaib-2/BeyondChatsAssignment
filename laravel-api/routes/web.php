<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'BeyondChats API is running. Use /api/articles for the API.',
        'data' => [
            'version' => '1.0.0',
            'documentation' => '/api/articles'
        ]
    ]);
});
