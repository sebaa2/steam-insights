<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SteamController;

Route::get('/test', [SteamController::class, 'test']);
Route::get('/resolve/{vanity}', [SteamController::class, 'resolve']);
Route::get('/profile/{steamId}', [SteamController::class, 'profile']);
Route::get('/profile/search/{input}',[SteamController::class, 'search']
);