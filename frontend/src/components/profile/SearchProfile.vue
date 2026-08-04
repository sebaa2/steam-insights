<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import HistoryList from '@/components/history/HistoryList.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue' // 👈 Importar
import { getHistory, saveHistory } from '@/services/historyService'
import { getDashboard } from '@/services/steamService'
import { useProfileStore } from '@/stores/profileStore'

const router = useRouter()
const profileStore = useProfileStore()
const search = ref('')
const history = ref(getHistory())
const errorMessage = ref('')
const isSearching = ref(false)

const handleSearch = async (query) => {
  // Evitar búsquedas múltiples
  if (isSearching.value) return
  
  const value = (query ?? search.value).trim()

  if (!value) {
    errorMessage.value = 'Ingresa un SteamID, URL personalizada o perfil'
    return
  }

  // Resetear estados
  errorMessage.value = ''
  isSearching.value = true
  profileStore.setLoading(true) // 👈 Activar loading en store
  profileStore.clearData()

  try {
    console.log('🔍 Buscando perfil:', value)
    const result = await getDashboard(value)
    console.log('✅ Datos obtenidos:', result)
    
    if (result?.profile?.steamId) {
      // Guardar en historial
      saveHistory(result.profile)
      history.value = getHistory()
      
      // Guardar en el store
      profileStore.setDashboardData(result)
      
      // Navegar a resultados
      console.log('🚀 Navegando a /results')
      await router.push('/results')
    } else {
      errorMessage.value = 'No se encontró el perfil'
      profileStore.setLoading(false)
      isSearching.value = false
    }
  } catch (error) {
    console.error('❌ Error en búsqueda:', error)
    errorMessage.value = 'No se pudo encontrar el perfil. Verifica el SteamID o la URL e intenta nuevamente.'
    profileStore.setLoading(false)
    isSearching.value = false
  }
}

const handleHistorySelect = (steamId) => {
  if (isSearching.value) return
  search.value = steamId
  handleSearch(steamId)
}

onMounted(() => {
  history.value = getHistory()
})
</script>

<template>
  <div class="search-card">
    <!-- 👇 LoadingOverlay cuando se está buscando -->
    <LoadingOverlay :show="isSearching" />

    <div class="search-container">
      <div class="search-input-wrapper">
        <AppInput 
          v-model="search" 
          placeholder="Ingresa un SteamID, URL personalizada o perfil"
          @keyup.enter="handleSearch(search)" 
        />
        <AppButton 
          label="Buscar perfil" 
          :disabled="isSearching" 
          @click="handleSearch(search)" 
        />
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <HistoryList :history="history" @select="handleHistorySelect" />
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

.search-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.error-message {
  color: var(--steam-error, #ff4d4f);
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .search-input-wrapper {
    flex-direction: column;
  }
}
</style>