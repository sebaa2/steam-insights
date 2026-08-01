<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Steam\SteamGamesService;
use App\Services\Steam\SteamProfileService;
use App\Services\Steam\SteamAchievementService;
use Illuminate\Http\JsonResponse;
use App\Services\Steam\SteamStatsService;

class SteamController extends Controller
{
    public function __construct(
        private SteamProfileService $profileService,
        private SteamGamesService $gamesService,
        private SteamStatsService $statsService,
        private SteamAchievementService $achievementService
    ) {
    }

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

    public function compare(string $player1, string $player2): JsonResponse
    {
        // Perfil 1
        $profile1 = $this->profileService->searchProfile($player1);

        $library1 = $this->gamesService->getOwnedGames(
            $profile1['steamId']
        );

        $stats1 = $this->statsService->calculate(
            $library1['games']
        );

        // Perfil 2
        $profile2 = $this->profileService->searchProfile($player2);

        $library2 = $this->gamesService->getOwnedGames(
            $profile2['steamId']
        );

        $stats2 = $this->statsService->calculate(
            $library2['games']
        );

        $games1 = collect($library1['games']);
        $games2 = collect($library2['games']);

        $sharedGames = $games1
            ->pluck('id')
            ->intersect(
                $games2->pluck('id')
            )
            ->count();

        $hoursDifference = abs(
            $stats1['totalHours'] - $stats2['totalHours']
        );

        $gamesDifference = abs(
            $library1['totalGames'] - $library2['totalGames']
        );

        $winnerHours =
            $stats1['totalHours'] >= $stats2['totalHours']
            ? 'player1'
            : 'player2';

        $winnerGames =
            $library1['totalGames'] >= $library2['totalGames']
            ? 'player1'
            : 'player2';

        $winnerAverage =
            $stats1['averageHours'] >= $stats2['averageHours']
            ? 'player1'
            : 'player2';

        return response()->json([

            'player1' => [
                'profile' => $profile1,
                'library' => $library1,
                'stats' => $stats1,
            ],

            'player2' => [
                'profile' => $profile2,
                'library' => $library2,
                'stats' => $stats2,
            ],

            'comparison' => [

                'sharedGames' => $sharedGames,

                'hoursDifference' => round($hoursDifference, 1),

                'gamesDifference' => $gamesDifference,

                'winnerHours' => $winnerHours,

                'winnerGames' => $winnerGames,

                'winnerAverage' => $winnerAverage,

            ],

        ]);
    }

    /**
     * Obtener logros de un juego
     */
    public function achievements(string $appId): JsonResponse
    {
        $steamId = request()->query('steamId');

        return response()->json(
            $this->achievementService->getGameAchievements($appId, $steamId)
        );
    }

    /**
     * Obtener estadísticas de logros del usuario
     */
    public function achievementStats(string $steamId): JsonResponse
    {
        return response()->json(
            $this->achievementService->getUserAchievementStats($steamId)
        );
    }

}