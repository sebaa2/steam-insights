import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)

  const saved = sessionStorage.getItem('profile')

  if (saved) {
    profile.value = JSON.parse(saved)
  }

  const setProfile = (data) => {
    profile.value = data

    sessionStorage.setItem('profile', JSON.stringify(data))
  }

  const clearProfile = () => {
    profile.value = null

    sessionStorage.removeItem('profile')
  }

  return {
    profile,
    setProfile,
    clearProfile,
  }
})
