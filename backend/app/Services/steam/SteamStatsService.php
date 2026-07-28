<?php

namespace App\Services\Steam;

use Illuminate\Support\Collection;

class SteamStatsService
{
    public function calculate(array|Collection $games): array
    {
        // Convertir a array si es una Collection
        if ($games instanceof Collection) {
            $games = $games->toArray();
        }

        if (empty($games)) {
            return [
                'totalHours' => 0,
                'averageHours' => 0,
                'favoriteGame' => null,
                'leastPlayed' => null,
                'neverPlayed' => 0,
                'completion' => 0,
            ];
        }

        $totalHours = array_sum(
            array_column($games, 'hoursPlayed')
        );

        $averageHours = round(
            $totalHours / count($games),
            1
        );

        $neverPlayed = count(
            array_filter(
                $games,
                fn ($game) => $game['hoursPlayed'] == 0
            )
        );

        $favoriteGame = collect($games)
            ->sortByDesc('hoursPlayed')
            ->first();

        $leastPlayed = collect($games)
            ->sortBy('hoursPlayed')
            ->first();

        $completion = round(
            ((count($games) - $neverPlayed) / count($games)) * 100,
            1
        );

        $hoursRanges = [
    '0h' => 0,
    '1-10h' => 0,
    '10-50h' => 0,
    '50-100h' => 0,
    '100h+' => 0,
];

foreach ($games as $game) {

    $hours = $game['hoursPlayed'];

    if ($hours == 0) {
        $hoursRanges['0h']++;
    } elseif ($hours <= 10) {
        $hoursRanges['1-10h']++;
    } elseif ($hours <= 50) {
        $hoursRanges['10-50h']++;
    } elseif ($hours <= 100) {
        $hoursRanges['50-100h']++;
    } else {
        $hoursRanges['100h+']++;
    }
}

$topFive = collect($games)
    ->sortByDesc('hoursPlayed')
    ->take(5)
    ->values();

    $playedGames = count(
    array_filter(
        $games,
        fn ($game) => $game['hoursPlayed'] > 0
    )
);

$recentGame = $favoriteGame;

        return [
            'totalHours' => $totalHours,
            'averageHours' => $averageHours,
            'favoriteGame' => $favoriteGame,
            'leastPlayed' => $leastPlayed,
            'neverPlayed' => $neverPlayed,
            'completion' => $completion,
            'hoursRanges' => $hoursRanges,
            'topFive' => $topFive,
            'playedGames' => $playedGames,
            'recentGame' => $recentGame,
        ];
    }
}