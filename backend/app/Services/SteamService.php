<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SteamService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.steam.key');
        $this->baseUrl = config('services.steam.url');
    }

    public function resolveVanity(string $vanity): array
    {
        $response = Http::get(
            "{$this->baseUrl}/ISteamUser/ResolveVanityURL/v1/",
            [
                'key' => $this->apiKey,
                'vanityurl' => $vanity,
            ]
        );

        return $response->json();
    }

    public function getPlayerSummaries(array $steamIds): array
    {
        $response = Http::get(
            "{$this->baseUrl}/ISteamUser/GetPlayerSummaries/v2/",
            [
                'key' => $this->apiKey,
                'steamids' => implode(',', $steamIds),
            ]
        );

        return $response->json();
    }
    public function searchProfile(string $input): array
{
    if (preg_match('/^\d{17}$/', $input)) {

        $steamId = $input;

    } else {

        $resolved = $this->resolveVanity($input);

        if (
            !isset($resolved['response']['success']) ||
            $resolved['response']['success'] !== 1
        ) {
            return [
                'error' => 'Usuario no encontrado'
            ];
        }

        $steamId = $resolved['response']['steamid'];
    }


    $profile = $this->getPlayerSummaries([$steamId]);


    if (
        empty($profile['response']['players'])
    ) {
        return [
            'error' => 'Perfil privado o inexistente'
        ];
    }


    $player = $profile['response']['players'][0];

return [
    'steamId' => $player['steamid'],
    'name' => $player['personaname'],
    'realName' => $player['realname'] ?? null,
    'avatar' => $player['avatarfull'],
    'country' => $player['loccountrycode'] ?? 'N/A',
    'status' => $player['personastate'],
    'profileUrl' => $player['profileurl'],
    'createdAt' => $player['timecreated'] ?? null,
];
}
}