<?php

namespace App\Http\Controllers;

use App\Services\Steam\SteamService;
use App\Services\Steam\SteamStatsService;

class SteamCompareController extends Controller
{

    public function compare(
        $steamId1,
        $steamId2,
        SteamService $steamService,
        SteamStatsService $statsService
    )
    {

        $player1Games = $steamService->getOwnedGames($steamId1);

        $player2Games = $steamService->getOwnedGames($steamId2);


        return response()->json([

            'player1'=>[
                'stats'=>$statsService->calculate(
                    $player1Games
                )
            ],

            'player2'=>[
                'stats'=>$statsService->calculate(
                    $player2Games
                )
            ]

        ]);

    }
}