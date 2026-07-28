<?php

namespace App\Services\Steam;

use Illuminate\Support\Facades\Http;

class SteamProfileService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.steam.key');
    }

    /**
     * Convierte un Vanity URL (ej: gaben) en un Steam ID.
     */
    public function resolveVanity(string $vanity): array
    {
        $response = Http::get(
            'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/',
            [
                'key' => $this->apiKey,
                'vanityurl' => $vanity,
            ]
        );

        return $response->json();
    }

    /**
     * Obtiene la información del perfil usando el Steam ID.
     */
    public function getPlayerSummary(string $steamId): array
    {
        $response = Http::get(
            'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/',
            [
                'key' => $this->apiKey,
                'steamids' => $steamId,
            ]
        );

        return $response->json();
    }

    /**
     * Busca un perfil usando un Steam ID o un Vanity URL.
     */
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

        $profile = $this->getPlayerSummary($steamId);

        if (empty($profile['response']['players'])) {
            return [
                'error' => 'Perfil privado o inexistente'
            ];
        }

        $player = $profile['response']['players'][0];

        return [
            'steamId'    => $player['steamid'],
            'name'       => $player['personaname'],
            'realName'   => $player['realname'] ?? null,
            'avatar'     => $player['avatarfull'],
            'country'    => $player['loccountrycode'] ?? 'N/A',
            'status'     => $player['personastate'],
            'profileUrl' => $player['profileurl'],
            'createdAt'  => $player['timecreated'] ?? null,
        ];
    }
}