import { computed } from 'vue'

export function useCommonGames(leftProfile, rightProfile) {
  const commonGames = computed(() => {
    if (!leftProfile.value || !rightProfile.value) return []

    const rightMap = new Map(rightProfile.value.library.games.map((g) => [g.id, g]))

    return leftProfile.value.library.games
      .filter((game) => rightMap.has(game.id))
      .map((game) => ({
        left: game,
        right: rightMap.get(game.id),
      }))
  })

  const leftExclusive = computed(() => {
    if (!leftProfile.value || !rightProfile.value) return []

    const rightIds = new Set(rightProfile.value.library.games.map((g) => g.id))

    return leftProfile.value.library.games.filter((g) => !rightIds.has(g.id))
  })

  const rightExclusive = computed(() => {
    if (!leftProfile.value || !rightProfile.value) return []

    const leftIds = new Set(leftProfile.value.library.games.map((g) => g.id))

    return rightProfile.value.library.games.filter((g) => !leftIds.has(g.id))
  })

  const similarity = computed(() => {
    if (!leftProfile.value || !rightProfile.value) return 0

    const total = Math.max(
      leftProfile.value.library.totalGames,
      rightProfile.value.library.totalGames,
    )

    return ((commonGames.value.length / total) * 100).toFixed(1)
  })

  return {
    commonGames,
    leftExclusive,
    rightExclusive,
    similarity,
  }
}
