<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profileStore'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import StatsGrid from '@/components/stats/StatsGrid.vue'
import GamesList from '@/components/games/GamesList.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const router = useRouter()
const profileStore = useProfileStore()

// Computed para acceder a los datos del store
const dashboard = computed(() => profileStore.dashboardData)
const loading = computed(() => profileStore.loading)
const error = computed(() => profileStore.error)
const hasData = computed(() => !!dashboard.value?.profile)

// Verificar si hay datos al montar
onMounted(() => {
    console.log('🏠 ResultsView montado')
    console.log('📊 Datos en store:', profileStore.dashboardData)

    // Si no hay datos en el store, redirigir al home
    if (!profileStore.dashboardData) {
        console.log('⚠️ No hay datos en store, redirigiendo a home')
        router.replace('/')
    } else {
        // Si hay datos, asegurar que loading esté en false
        profileStore.setLoading(false)
    }
})

// Watch para detectar cambios en los datos
watch(() => profileStore.dashboardData, (newData) => {
    console.log('🔄 Datos actualizados en store:', newData)
    if (newData) {
        profileStore.setLoading(false)
    }
})

const goBack = () => {
    profileStore.clearData()
    router.push('/')
}

const goToAllGames = (steamId) => {
    if (steamId) {
        router.push(`/games/${steamId}`)
    }
}
</script>

<template>
    <main class="results-view">
        <!-- Loading Overlay -->
        <LoadingOverlay :show="loading" />

        <div class="container">
            <!-- Botón volver -->
            <button class="back-btn" @click="goBack">
                ← Volver al inicio
            </button>

            <!-- Error -->
            <div v-if="error" class="error-state">
                <p class="error-message">{{ error }}</p>
                <button class="retry-btn" @click="goBack">Intentar de nuevo</button>
            </div>

            <!-- Resultados -->
            <template v-else-if="hasData">
                <ProfileCard :profile="dashboard.profile" />
                <StatsGrid :library="dashboard.library" :stats="dashboard.stats" />
                <DashboardCharts v-if="dashboard?.stats" :stats="dashboard.stats" />

                <section v-if="dashboard?.library" class="library-section">
                    <GamesList :games="dashboard.stats?.topFive || []" :total-games="dashboard.library.totalGames"
                        title="Top 5 juegos más jugados" :show-view-all-button="true"
                        :steam-id="dashboard.profile?.steamId" @view-all="goToAllGames(dashboard.profile?.steamId)" />
                </section>
            </template>

            <!-- Estado vacío (por si acaso) -->
            <div v-else-if="!loading && !hasData" class="empty-state">
                <p>No hay datos para mostrar</p>
                <button class="retry-btn" @click="goBack">Volver al inicio</button>
            </div>
        </div>
    </main>
</template>

<style scoped>
.results-view {
    min-height: calc(100vh - 80px);
    padding: 2rem;
    display: flex;
    justify-content: center;
}

.container {
    max-width: 650px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.back-btn {
    align-self: flex-start;
    background: transparent;
    border: 1px solid var(--steam-border);
    color: var(--steam-text-secondary);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.back-btn:hover {
    background: var(--steam-border);
    color: var(--steam-text-primary);
}

.error-state {
    text-align: center;
    padding: 3rem;
    background: var(--steam-surface);
    border-radius: 12px;
}

.error-message {
    color: var(--steam-error, #ff4d4f);
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

.retry-btn {
    padding: 0.6rem 1.5rem;
    background: var(--steam-primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
}

.retry-btn:hover {
    background: var(--steam-primary-hover);
}

.empty-state {
    text-align: center;
    padding: 3rem;
    background: var(--steam-surface);
    border-radius: 12px;
    color: var(--steam-text-secondary);
}

.library-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (max-width: 768px) {
    .results-view {
        padding: 1rem;
    }
}
</style>