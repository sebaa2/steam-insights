// composables/useGames.js
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getOwnedGames } from '@/services/steamService'

export function useGames() {
  const route = useRoute()

  // Estado
  const games = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const sortBy = ref('hoursPlayed')
  const filterUnplayed = ref(false)

  // Juegos filtrados
  const filteredGames = computed(() => {
    let result = [...games.value]

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter((game) => game.name?.toLowerCase().includes(query))
    }

    if (filterUnplayed.value) {
      result = result.filter((game) => game.hoursPlayed > 0)
    }

    result.sort((a, b) => {
      if (sortBy.value === 'hoursPlayed') return b.hoursPlayed - a.hoursPlayed
      if (sortBy.value === 'name') return a.name?.localeCompare(b.name) || 0
      return b.minutesPlayed - a.minutesPlayed
    })

    return result
  })

  // Estadísticas
  const stats = computed(() => {
    if (!games.value.length) {
      return { total: 0, played: 0, unplayed: 0 }
    }
    const total = games.value.length
    const unplayed = games.value.filter((g) => g.hoursPlayed === 0).length
    return { total, played: total - unplayed, unplayed }
  })

  // Obtener Steam ID
  const getSteamId = () => {
    return route.params.steamId || null
  }

  // Cargar juegos
  const loadGames = async () => {
    const steamId = getSteamId()

    if (!steamId) {
      error.value = 'No se encontró un Steam ID válido'
      return
    }

    // Activar loading antes de la petición
    loading.value = true
    error.value = null

    try {
      const response = await getOwnedGames(steamId)

      if (response?.library?.games?.length > 0) {
        games.value = response.library.games.map((game) => ({
          id: game.id || game.appid || 0,
          name: game.name || 'Juego sin nombre',
          hoursPlayed: game.hoursPlayed || 0,
          minutesPlayed: game.minutesPlayed || 0,
          image:
            game.image ||
            `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.id || game.appid}/header.jpg`,
        }))
      } else {
        error.value = 'No se encontraron juegos en esta biblioteca'
        games.value = []
      }
    } catch (err) {
      console.error('Error al cargar juegos:', err)
      error.value = err.message || 'Error al cargar los juegos'
      games.value = []
    } finally {
      // Desactivar loading después de la petición
      loading.value = false
    }
  }

  // Formatear horas
  const formatHours = (hours) => {
    if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k h`
    if (hours === 0) return 'Sin jugar'
    if (hours < 1) return `${Math.round(hours * 60)} min`
    return `${hours.toFixed(1)} h`
  }

  const openGame = (id) => {
    if (id) window.open(`https://store.steampowered.com/app/${id}`, '_blank')
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  const reloadGames = () => {
    loadGames()
  }

  const handleImageError = (event) => {
    event.target.src = '/images/placeholder-game.jpg'
  }

  // Watch para detectar cambios en el Steam ID y cargar automáticamente
  watch(
    () => route.params.steamId,
    (newSteamId) => {
      if (newSteamId) {
        loadGames()
      }
    },
    { immediate: true }, // Se ejecuta al montar el componente
  )

  // Respaldo por si el watch no funciona
  onMounted(() => {
    const steamId = getSteamId()
    if (steamId && games.value.length === 0) {
      loadGames()
    }
  })

  return {
    games,
    loading,
    error,
    searchQuery,
    sortBy,
    filterUnplayed,
    filteredGames,
    stats,
    loadGames,
    reloadGames,
    formatHours,
    openGame,
    clearSearch,
    handleImageError,
    getSteamId,
  }
}
