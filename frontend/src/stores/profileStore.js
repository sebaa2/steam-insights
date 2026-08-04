import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  // Estado existente
  const profile = ref(null)
  const saved = sessionStorage.getItem('profile')

  if (saved) {
    profile.value = JSON.parse(saved)
  }

  // 👇 NUEVO: Estado para dashboard
  const dashboardData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Funciones existentes
  const setProfile = (data) => {
    profile.value = data
    sessionStorage.setItem('profile', JSON.stringify(data))
  }

  const clearProfile = () => {
    profile.value = null
    sessionStorage.removeItem('profile')
  }

  // 👇 NUEVAS: Funciones para dashboard
  const setDashboardData = (data) => {
    dashboardData.value = data
    // También actualizar el profile si viene en los datos
    if (data?.profile) {
      setProfile({
        ...data.profile,
        totalGames: data.library?.totalGames,
        totalHours: data.stats?.totalHours,
      })
    }
    loading.value = false
  }

  const setLoading = (status) => {
    loading.value = status
  }

  const setError = (message) => {
    error.value = message
    loading.value = false
  }

  const clearData = () => {
    dashboardData.value = null
    error.value = null
    loading.value = false
  }

  return {
    // Estado existente
    profile,
    setProfile,
    clearProfile,

    // 👇 NUEVO: Estado y funciones
    dashboardData,
    loading,
    error,
    setDashboardData,
    setLoading,
    setError,
    clearData,
  }
})
