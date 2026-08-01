<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SteamController;

Route::get('/test', [SteamController::class, 'test']);
Route::get('/resolve/{vanity}', [SteamController::class, 'resolve']);
Route::get('/profile/{steamId}', [SteamController::class, 'profile']);
Route::get('/profile/search/{input}', [SteamController::class, 'search']);
Route::get('/profile/{steamId}/games', [SteamController::class, 'games']);
Route::get('/dashboard/{input}', [SteamController::class, 'dashboard']);

Route::get('/achievements/{appId}', [SteamController::class, 'achievements']);
Route::get('/achievements/stats/{steamId}', [SteamController::class, 'achievementStats']);

Route::get('/compare/{player1}/{player2}', [SteamController::class, 'compare']);
