import { ref, computed } from 'vue'

export function useGameFilters(games) {
  const search = ref('')

  const sort = ref('hours-desc')

  const status = ref('all')

  const filteredGames = computed(() => {
    let list = [...games.value]

    // Buscar
    if (search.value.trim()) {
      const query = search.value.toLowerCase()

      list = list.filter((game) => game.name.toLowerCase().includes(query))
    }

    // Estado

    if (status.value === 'played') {
      list = list.filter((game) => game.hoursPlayed > 0)
    }

    if (status.value === 'unplayed') {
      list = list.filter((game) => game.hoursPlayed === 0)
    }

    if (status.value === '100plus') {
      list = list.filter((game) => game.hoursPlayed >= 100)
    }

    // Orden

    switch (sort.value) {
      case 'hours-desc':
        list.sort((a, b) => b.hoursPlayed - a.hoursPlayed)
        break

      case 'hours-asc':
        list.sort((a, b) => a.hoursPlayed - b.hoursPlayed)
        break

      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break

      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return list
  })

  return {
    search,

    sort,

    status,

    filteredGames,
  }
}
