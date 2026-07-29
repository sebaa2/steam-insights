import { computed } from 'vue'

export function useTopGamesComparison(leftProfile, rightProfile) {

    const topGames = computed(() => {

        if (!leftProfile.value || !rightProfile.value)
            return []

        const rightMap = new Map(
            rightProfile.value.stats.topFive.map(g => [g.id, g])
        )

        return leftProfile.value.stats.topFive.map(leftGame => ({

            left: leftGame,

            right: rightMap.get(leftGame.id) || null

        }))

    })

    return {
        topGames
    }

}