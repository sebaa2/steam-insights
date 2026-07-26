<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SteamService;
use Illuminate\Http\JsonResponse;

class SteamController extends Controller
{
    public function __construct(
        private SteamService $steamService
    ) {}

    public function test(): JsonResponse
    {
        return response()->json(
            $this->steamService->test()
        );
    }

    public function resolve(string $vanity)
    {
        return response()->json(
            $this->steamService->resolveVanity($vanity)
        );
    }

    public function profile(string $steamId)
    {
        return response()->json(
            $this->steamService->getPlayerSummaries([$steamId])
        );
    }

    public function search(string $input)
    {
        return response()->json(
            $this->steamService->searchProfile($input)
        );
    }
}