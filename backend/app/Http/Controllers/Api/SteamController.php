<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Steam\SteamGamesService;
use App\Services\Steam\SteamProfileService;
use Illuminate\Http\JsonResponse;
use App\Services\Steam\SteamStatsService;

class SteamController extends Controller
{
    public function __construct(
        private SteamProfileService $profileService,
        private SteamGamesService $gamesService,
        private SteamStatsService $statsService
    ) {}

    public function test(): JsonResponse
    {
        return response()->json([
            'message' => 'Steam API funcionando'
        ]);
    }

    public function resolve(string $vanity): JsonResponse
    {
        return response()->json(
            $this->profileService->resolveVanity($vanity)
        );
    }

    public function profile(string $steamId): JsonResponse
    {
        return response()->json(
            $this->profileService->getPlayerSummary($steamId)
        );
    }

    public function search(string $input): JsonResponse
    {
        return response()->json(
            $this->profileService->searchProfile($input)
        );
    }

    public function games(string $steamId): JsonResponse
{
    $library = $this->gamesService->getOwnedGames($steamId);

    $stats = $this->statsService->calculate(
        $library['games']
    );

    return response()->json([
        'library' => $library,
        'stats' => $stats,
    ]);
}

public function dashboard(string $input): JsonResponse
{
    $profile = $this->profileService->searchProfile($input);

    $library = $this->gamesService->getOwnedGames(
        $profile['steamId']
    );

    $stats = $this->statsService->calculate(
        $library['games']
    );

    return response()->json([
        'profile' => $profile,
        'library' => $library,
        'stats' => $stats,
    ]);
}

}