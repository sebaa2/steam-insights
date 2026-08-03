// composables/useAchievements.js
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getGameAchievements } from '@/services/steamService'
import { sessionService } from '@/services/sessionService'

export function useAchievements() {
  const route = useRoute()
  const appId = computed(() => route.params.appId)
  const gameNameFromQuery = computed(() => route.query.gameName || null)

  // Estado
  const loading = ref(false)
  const error = ref(null)
  const achievementsData = ref(null)

  // Debug controlado por Konami Code
  const showDebug = ref(false)

  const debugInfo = ref({
    status: 'Inicializando...',
    lastRequest: null,
    responseTime: null,
    dataSize: null,
    errors: [],
  })

  // Computed para estadísticas
  const stats = computed(() => {
    if (!achievementsData.value || !achievementsData.value.achievements) {
      return { total: 0, achieved: 0, percentage: 0 }
    }
    const total = achievementsData.value.achievements.length
    const achieved = achievementsData.value.achievements.filter((a) => a.achieved === true).length
    return {
      total,
      achieved,
      percentage: total > 0 ? Math.round((achieved / total) * 100) : 0,
    }
  })

  // Computed para usuario
  const isLoggedIn = computed(() => sessionService.isLoggedIn())
  const username = computed(() => sessionService.getUsername())

  // Computed para el nombre del juego
  const gameDisplayName = computed(() => {
    if (gameNameFromQuery.value) {
      return gameNameFromQuery.value
    }
    if (achievementsData.value?.gameName && achievementsData.value.gameName !== '') {
      return achievementsData.value.gameName
    }
    return `Juego ${appId.value}`
  })

  const fetchAchievements = async () => {
    if (loading.value) return

    const startTime = Date.now()
    debugInfo.value.status = 'Cargando logros...'
    debugInfo.value.errors = []

    loading.value = true
    error.value = null

    try {
      debugInfo.value.status = `Obteniendo logros para appId: ${appId.value}`
      debugInfo.value.lastRequest = new Date().toLocaleTimeString()

      const data = await getGameAchievements(appId.value)

      const endTime = Date.now()
      debugInfo.value.responseTime = `${endTime - startTime}ms`
      debugInfo.value.dataSize = data.achievements
        ? `${data.achievements.length} logros`
        : '0 logros'

      achievementsData.value = data
      debugInfo.value.status = 'Completado ✅'

      if (data.error) {
        debugInfo.value.errors.push(`Error en datos: ${data.error}`)
      }
    } catch (err) {
      const endTime = Date.now()
      debugInfo.value.responseTime = `${endTime - startTime}ms`
      debugInfo.value.status = 'Error ❌'
      debugInfo.value.errors.push(err.message || 'Error desconocido')
      error.value = err.message || 'Error al cargar los logros'
      console.error('❌ Error detallado:', err)
    } finally {
      loading.value = false
    }
  }

  const retry = () => {
    debugInfo.value.errors = []
    fetchAchievements()
  }

  // ✅ Función para activar debug (ahora la controla KonamiActivator)
  const activateDebug = () => {
    showDebug.value = true
    console.log('🔍 Panel de debug activado')
  }

  // ✅ Función para desactivar debug
  const deactivateDebug = () => {
    showDebug.value = false
  }

  // Watch para detectar cambios en la ruta
  watch(
    () => route.params.appId,
    (newAppId) => {
      if (newAppId) {
        fetchAchievements()
        // Resetear el debug al cambiar de juego
        showDebug.value = false
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    if (appId.value && !achievementsData.value) {
      fetchAchievements()
    }
  })

  return {
    // Estado
    loading,
    error,
    achievementsData,
    showDebug,
    debugInfo,
    // Computed
    stats,
    isLoggedIn,
    username,
    appId,
    gameDisplayName,
    // Métodos
    fetchAchievements,
    retry,
    activateDebug,
    deactivateDebug,
  }
}
