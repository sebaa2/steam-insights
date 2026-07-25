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
}