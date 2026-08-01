// services/steamService.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
})

// Interceptor para logs de peticiones
api.interceptors.request.use(
  (request) => {
    console.log('🚀 [REQUEST]', request.method.toUpperCase(), request.url)
    console.log('📋 [REQUEST HEADERS]', request.headers)
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
    console.log('📦 [RESPONSE DATA]', response.data)
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

export async function searchProfile(input) {
  console.log('🔍 searchProfile llamado con:', input)
  const response = await api.get(`/profile/search/${input}`)
  return response.data
}

export async function getOwnedGames(steamId) {
  console.log('🎮 getOwnedGames llamado con steamId:', steamId)
  console.log('🔗 URL completa:', `http://127.0.0.1:8000/api/profile/${steamId}/games`)

  try {
    const response = await api.get(`/profile/${steamId}/games`)
    console.log('🎮 getOwnedGames - respuesta recibida:', response)
    console.log('🎮 getOwnedGames - data:', response.data)
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

export default api
