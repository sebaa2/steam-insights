// services/steamService.js
import axios from 'axios'
import { sessionService } from './sessionService'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
})

// Interceptor para logs de peticiones
api.interceptors.request.use(
  (request) => {
    console.log('🚀 [REQUEST]', request.method.toUpperCase(), request.url)
    return request
  },
  (error) => {
    console.error('❌ [REQUEST ERROR]', error)
    return Promise.reject(error)
  },
)

// Interceptor para logs de respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ [RESPONSE]', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ [RESPONSE ERROR]', error.message)
    console.error('🔍 [ERROR URL]', error.config?.url)
    console.error('📊 [ERROR STATUS]', error.response?.status)
    console.error('📦 [ERROR DATA]', error.response?.data)
    return Promise.reject(error)
  },
)

// Funciones existentes
export async function searchProfile(input) {
  console.log('🔍 searchProfile llamado con:', input)
  const response = await api.get(`/profile/search/${input}`)
  return response.data
}

export async function getOwnedGames(steamId) {
  console.log('🎮 getOwnedGames llamado con steamId:', steamId)
  try {
    const response = await api.get(`/profile/${steamId}/games`)
    return response.data
  } catch (error) {
    console.error('🎮 getOwnedGames - ERROR:', error)
    throw error
  }
}

export async function getDashboard(input) {
  console.log('📊 getDashboard llamado con:', input)
  const response = await api.get(`/dashboard/${input}`)
  return response.data
}

export const compareProfiles = async (steamId1, steamId2) => {
  console.log('⚖️ compareProfiles llamado con:', steamId1, steamId2)
  const response = await api.get(`/compare/${steamId1}/${steamId2}`)
  return response.data
}

// Cache para evitar peticiones duplicadas
const achievementCache = new Map()

// Función para obtener logros
export async function getGameAchievements(appId, steamId = null) {
  console.log('🏆 getGameAchievements llamado con appId:', appId, 'steamId:', steamId)

  // Si no se proporciona steamId, intentamos obtenerlo del servicio de sesión
  if (!steamId) {
    steamId = sessionService.getSteamId()
  }

  // Crear clave de caché
  const cacheKey = `${appId}_${steamId || 'anonymous'}`

  // Verificar caché (solo si no estamos forzando recarga)
  if (achievementCache.has(cacheKey)) {
    const cached = achievementCache.get(cacheKey)
    const now = Date.now()
    // Cache por 1 minuto
    if (now - cached.timestamp < 60 * 1000) {
      console.log('📦 Usando datos en caché para:', appId)
      return cached.data
    }
  }

  try {
    const url = steamId ? `/achievements/${appId}?steamId=${steamId}` : `/achievements/${appId}`

    const response = await api.get(url)

    // Guardar en caché
    achievementCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    })

    return response.data
  } catch (error) {
    console.error('🏆 getGameAchievements - ERROR:', error)
    throw error
  }
}

// Función para limpiar caché
export function clearAchievementCache() {
  achievementCache.clear()
  console.log('🗑️ Caché de logros limpiado')
}

// Función para obtener estadísticas de logros
export async function getUserAchievementStats(steamId = null) {
  if (!steamId) {
    steamId = sessionService.getSteamId()
  }

  if (!steamId) {
    throw new Error('No se encontró Steam ID en el perfil')
  }

  console.log('📊 getUserAchievementStats llamado con steamId:', steamId)
  try {
    const response = await api.get(`/achievements/stats/${steamId}`)
    return response.data
  } catch (error) {
    console.error('📊 getUserAchievementStats - ERROR:', error)
    throw error
  }
}

export default api
