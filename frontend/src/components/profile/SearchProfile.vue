<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import StatsGrid from '@/components/stats/StatsGrid.vue'
import GamesList from '@/components/games/GamesList.vue'
import HistoryList from '@/components/history/HistoryList.vue'
import { getHistory, saveHistory } from '@/services/historyService'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import { useProfileStore } from '@/stores/profileStore'

import { getDashboard } from '@/services/steamService'

const router = useRouter()
const search = ref('')
const dashboard = ref(null)
const loading = ref(false)
const history = ref(getHistory())
const profileStore = useProfileStore()
const errorMessage = ref('')

const handleSearch = async (query) => {
  const value = (query ?? search.value).trim()

  if (!value) {
    errorMessage.value = 'Ingresa un SteamID, URL personalizada o perfil'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await getDashboard(value)

    saveHistory(dashboard.value.profile)
    history.value = getHistory()

    // Sincroniza el store global con los datos combinados del dashboard
    if (dashboard.value?.profile) {
      profileStore.setProfile({
        ...dashboard.value.profile,
        totalGames: dashboard.value.library?.totalGames,
        totalHours: dashboard.value.stats?.totalHours
      })
    }
  } catch (error) {
    console.error(error)
    dashboard.value = null
    errorMessage.value = 'No se pudo encontrar el perfil. Verifica el SteamID o la URL e intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

// Navegar a la vista completa de juegos
const goToAllGames = (steamId) => {
  if (steamId) {
    router.push(`/games/${steamId}`)
  }
}
</script>

<template>
  <LoadingOverlay :show="loading" />

  <div class="search-card">
    <AppInput v-model="search" placeholder="Ingresa un SteamID, URL personalizada o perfil"
      @keyup.enter="handleSearch(search)" />
    <AppButton label="Buscar perfil" :disabled="loading" @click="handleSearch(search)" />

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <ProfileCard v-if="dashboard?.profile" :profile="dashboard.profile" />
    <StatsGrid v-if="dashboard?.library && dashboard?.stats" :library="dashboard.library" :stats="dashboard.stats" />
    <DashboardCharts v-if="dashboard?.stats" :stats="dashboard.stats" />

    <section v-if="dashboard?.library" class="library-section">
      <GamesList :games="dashboard.stats?.topFive || []" :total-games="dashboard.library.totalGames"
        title="Top 5 juegos más jugados" :show-view-all-button="true" :steam-id="dashboard.profile?.steamId"
        @view-all="goToAllGames(dashboard.profile?.steamId)" />
    </section>

    <HistoryList :history="history" @select="handleSearch" />
  </div>
</template>

<style scoped>
.search-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}

.library-section {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  color: var(--steam-error, #ff4d4f);
  font-size: 0.9rem;
  margin: 0;
}
</style>