<?php

namespace App\Services\Steam;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteamAchievementService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.steam.key');
        $this->baseUrl = config('services.steam.url', 'http://api.steampowered.com');
    }

    /**
     * Obtener logros de un juego específico
     */
    public function getGameAchievements(string $appId, ?string $steamId = null): array
    {
        try {
            // Obtener esquema de logros del juego
            $schema = $this->fetchGameSchema($appId);

            if (!$schema) {
                return $this->emptyAchievementsResponse($appId);
            }

            // Obtener logros del usuario si se proporciona steamId
            $userAchievements = $steamId ? $this->fetchUserAchievements($appId, $steamId) : [];

            // Procesar y formatear los logros
            $achievements = $this->formatAchievements($schema, $userAchievements);

            return [
                'appId' => (int) $appId,
                'gameName' => $schema['gameName'] ?? 'Juego Desconocido',
                'totalAchievements' => count($achievements),
                'achievements' => $achievements,
                'hasUserData' => !empty($userAchievements),
                'userSteamId' => $steamId,
            ];

        } catch (\Exception $e) {
            Log::error('Error al obtener logros del juego', [
                'appId' => $appId,
                'steamId' => $steamId,
                'error' => $e->getMessage()
            ]);

            return $this->errorResponse($appId, $e->getMessage());
        }
    }

    /**
     * Obtener estadísticas de logros del usuario
     */
    public function getUserAchievementStats(string $steamId): array
    {
        try {
            $gamesService = app(SteamGamesService::class);
            $library = $gamesService->getOwnedGames($steamId);

            $stats = [
                'steamId' => $steamId,
                'totalGames' => $library['totalGames'] ?? 0,
                'gamesWithAchievements' => 0,
                'totalAchievements' => 0,
                'totalAchieved' => 0,
                'completionPercentage' => 0,
                'gameAchievements' => [],
            ];

            // Limitar a los primeros 20 juegos para rendimiento
            $gamesToProcess = array_slice($library['games'] ?? [], 0, 20);

            foreach ($gamesToProcess as $game) {
                $gameId = $game['id'];
                $achievements = $this->getGameAchievements($gameId, $steamId);

                if (!empty($achievements['achievements']) && $achievements['hasUserData']) {
                    $stats['gamesWithAchievements']++;

                    $gameStats = $this->calculateGameAchievementStats($achievements['achievements']);
                    $stats['totalAchievements'] += $gameStats['total'];
                    $stats['totalAchieved'] += $gameStats['achieved'];

                    $stats['gameAchievements'][$gameId] = [
                        'gameName' => $achievements['gameName'],
                        'achievements' => $achievements['achievements'],
                        'stats' => $gameStats,
                    ];
                }
            }

            // Calcular porcentaje global
            if ($stats['totalAchievements'] > 0) {
                $stats['completionPercentage'] = round(
                    ($stats['totalAchieved'] / $stats['totalAchievements']) * 100,
                    2
                );
            }

            return $stats;

        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas de logros', [
                'steamId' => $steamId,
                'error' => $e->getMessage()
            ]);

            return [
                'steamId' => $steamId,
                'totalGames' => 0,
                'gamesWithAchievements' => 0,
                'totalAchievements' => 0,
                'totalAchieved' => 0,
                'completionPercentage' => 0,
                'gameAchievements' => [],
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Obtener esquema del juego desde Steam API
     */
    private function fetchGameSchema(string $appId): ?array
    {
        $response = Http::get("{$this->baseUrl}/ISteamUserStats/GetSchemaForGame/v2/", [
            'key' => $this->apiKey,
            'appid' => $appId,
        ]);

        if (!$response->successful()) {
            Log::warning('Error al obtener esquema de logros', [
                'appId' => $appId,
                'status' => $response->status(),
            ]);
            return null;
        }

        $data = $response->json();
        return $data['game'] ?? null;
    }

    /**
     * Obtener logros del usuario desde Steam API
     */
    private function fetchUserAchievements(string $appId, string $steamId): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/ISteamUserStats/GetPlayerAchievements/v1/", [
                'key' => $this->apiKey,
                'steamid' => $steamId,
                'appid' => $appId,
            ]);

            if (!$response->successful()) {
                return [];
            }

            $data = $response->json();
            $achievements = $data['playerstats']['achievements'] ?? [];

            return collect($achievements)->mapWithKeys(function ($item) {
                return [$item['apiname'] => $item['achieved'] == 1];
            })->toArray();

        } catch (\Exception $e) {
            Log::warning('No se pudieron obtener logros del usuario', [
                'appId' => $appId,
                'steamId' => $steamId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Formatear los logros para la respuesta
     */
    private function formatAchievements(array $schema, array $userAchievements): array
    {
        $availableAchievements = $schema['availableGameStats']['achievements'] ?? [];

        return collect($availableAchievements)->map(function ($achievement) use ($userAchievements) {
            $name = $achievement['name'] ?? 'logro_sin_nombre';

            return [
                'name' => $name,
                'displayName' => $achievement['displayName'] ?? $name,
                'description' => $achievement['description'] ?? 'Sin descripción',
                'icon' => $achievement['icon'] ?? null,
                'iconGray' => $achievement['icongray'] ?? null,
                'hidden' => $achievement['hidden'] ?? 0,
                'achieved' => $userAchievements[$name] ?? null,
            ];
        })->toArray();
    }

    /**
     * Calcular estadísticas de logros de un juego
     */
    private function calculateGameAchievementStats(array $achievements): array
    {
        $total = count($achievements);
        $achieved = collect($achievements)
            ->filter(fn($ach) => $ach['achieved'] === true)
            ->count();

        return [
            'total' => $total,
            'achieved' => $achieved,
            'percentage' => $total > 0 ? round(($achieved / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Respuesta vacía para juegos sin logros
     */
    private function emptyAchievementsResponse(string $appId): array
    {
        return [
            'appId' => (int) $appId,
            'gameName' => 'Juego Desconocido',
            'totalAchievements' => 0,
            'achievements' => [],
            'hasUserData' => false,
            'userSteamId' => null,
        ];
    }

    /**
     * Respuesta de error
     */
    private function errorResponse(string $appId, string $errorMessage): array
    {
        return [
            'appId' => (int) $appId,
            'gameName' => 'Juego Desconocido',
            'totalAchievements' => 0,
            'achievements' => [],
            'hasUserData' => false,
            'userSteamId' => null,
            'error' => $errorMessage,
        ];
    }
}