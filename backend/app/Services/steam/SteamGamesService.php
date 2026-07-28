<?php

namespace App\Services\Steam;

use Illuminate\Support\Facades\Http;

class SteamGamesService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.steam.key');
    }

public function getOwnedGames(string $steamId): array
{
    $response = Http::get(
        'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/',
        [
            'key' => $this->apiKey,
            'steamid' => $steamId,
            'include_appinfo' => true,
            'include_played_free_games' => true,
        ]
    );

    $data = $response->json();

    $games = collect($data['response']['games'] ?? [])
        ->map(function ($game) {
            return [
                'id' => $game['appid'],
                'name' => $game['name'],
                'minutesPlayed' => $game['playtime_forever'],
                'hoursPlayed' => round($game['playtime_forever'] / 60, 1),
                'image' => "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/{$game['appid']}/header.jpg",
            ];
        });

    $topGames = $games
        ->sortByDesc('hoursPlayed')
        ->take(10)
        ->values();

    return [
        'totalGames' => $data['response']['game_count'] ?? 0,
        'games' => $games->values(),
        'topGames' => $topGames,
    ];
}
}