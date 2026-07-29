// src/composables/useCompareWinner.js
export function useCompareWinner() {
  const getWinner = (leftValue, rightValue, reverse = false) => {
    const l = Number(leftValue) || 0
    const r = Number(rightValue) || 0

    if (l === r) return 'empate'
    if (reverse) {
      return l < r ? 'left' : 'right'
    }
    return l > r ? 'left' : 'right'
  }

  const getOverallWinner = (leftProfile, rightProfile) => {
    if (!leftProfile || !rightProfile) return null

    let leftWins = 0
    let rightWins = 0
    let ties = 0

    const categoriesHigher = [
      { left: leftProfile.library.totalGames, right: rightProfile.library.totalGames },
      { left: leftProfile.stats.totalHours, right: rightProfile.stats.totalHours },
      { left: leftProfile.stats.averageHours, right: rightProfile.stats.averageHours },
      { left: leftProfile.stats.completion, right: rightProfile.stats.completion },
    ]

    const categoriesLower = [
      { left: leftProfile.stats.neverPlayed, right: rightProfile.stats.neverPlayed },
    ]

    categoriesHigher.forEach(({ left, right }) => {
      const result = getWinner(left, right)
      if (result === 'left') leftWins++
      else if (result === 'right') rightWins++
      else ties++
    })

    categoriesLower.forEach(({ left, right }) => {
      const result = getWinner(left, right, true)
      if (result === 'left') leftWins++
      else if (result === 'right') rightWins++
      else ties++
    })

    if (leftWins > rightWins) {
      return { winner: 'left', name: leftProfile.profile.name, leftWins, rightWins, ties }
    }
    if (rightWins > leftWins) {
      return { winner: 'right', name: rightProfile.profile.name, leftWins, rightWins, ties }
    }
    return { winner: 'tie', leftWins, rightWins, ties }
  }

  return {
    getWinner,
    getOverallWinner,
  }
}
