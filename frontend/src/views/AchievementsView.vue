<script setup>
import { useAchievements } from '@/composables/useAchievements'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import AchievementsList from '@/components/achievements/AchievementsList.vue'
import DebugMenu from '@/components/achievements/DebugMenu.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const {
    loading,
    error,
    achievementsData,
    stats,
    isLoggedIn,
    username,
    appId,
    gameDisplayName,
    showDebug,
    retry,
    activateDebug,
    deactivateDebug
} = useAchievements()

const goBack = () => router.back()
const openSteamStore = () => window.open(`https://store.steampowered.com/app/${appId.value}`, '_blank')
</script>

<template>
    <div class="achievements-view">
        <!-- Loading Overlay -->
        <LoadingOverlay :show="loading">
            <h2>Cargando logros del juego...</h2>
            <p>Obteniendo información desde Steam</p>
            <small style="color: #8b9aab; font-size: 0.85rem;">App ID: {{ appId }}</small>
        </LoadingOverlay>

        <!-- Debug Menu -->
        <DebugMenu :show="showDebug" :app-id="appId" :game-name="gameDisplayName" :username="username" :stats="stats"
            :achievements-data="achievementsData" @close="deactivateDebug" @reload="retry" />

        <!-- Header -->
        <div class="header">
            <button @click="goBack" class="back-button">← Volver</button>
            <h1>🏆 Logros del juego</h1>
            <div class="header-actions">
                <button @click="retry" class="reload-btn" :disabled="loading" :class="{ 'spinning': loading }">
                    ⟳ Recargar
                </button>
            </div>
        </div>

        <!-- Estado: Error -->
        <div v-if="error && !loading" class="error-state">
            <div class="error-icon">❌</div>
            <h3>Error al cargar los logros</h3>
            <p>{{ error }}</p>
            <button @click="retry" class="retry-btn">Intentar de nuevo</button>
        </div>

        <!-- Estado: Sin logros -->
        <div v-else-if="!loading && achievementsData?.achievements?.length === 0" class="empty-state">
            <div class="empty-icon">🎯</div>
            <h3>Este juego no tiene logros</h3>
            <p>No hay logros disponibles para este juego en Steam.</p>
            <button @click="openSteamStore" class="steam-store-btn">Ver en Steam</button>
        </div>

        <!-- Estado: Con logros -->
        <AchievementsList v-else-if="!loading && achievementsData?.achievements?.length > 0" :achievements-data="{
            ...achievementsData,
            gameName: gameDisplayName
        }" :stats="stats" :username="username" :is-logged-in="isLoggedIn" @open-store="openSteamStore"
            @debug-click="activateDebug" />

        <!-- Estado: Datos inesperados -->
        <div v-else-if="!loading && !error && !achievementsData" class="empty-state">
            <div class="empty-icon">🤔</div>
            <h3>No se pudieron cargar los logros</h3>
            <p>La respuesta del servidor no contiene datos válidos.</p>
            <button @click="retry" class="retry-btn">Intentar de nuevo</button>
        </div>
    </div>
</template>

<style scoped>
.achievements-view {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    color: #e0e0e0;
    min-height: 100vh;
    background: #0a1a2a;
}

.header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
}

.back-button {
    background: #2a3f52;
    color: #e0e0e0;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
}

.back-button:hover {
    background: #3a5a6a;
    transform: translateX(-2px);
}

.header h1 {
    margin: 0;
    color: #e0e0e0;
    font-size: 1.8rem;
}

.reload-btn {
    background: #2a3f52;
    color: #e0e0e0;
    border: none;
    padding: 0.7rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
}

.reload-btn.spinning {
    animation: spin 1s linear infinite;
}

.reload-btn:hover:not(:disabled):not(.spinning) {
    background: #3a5a6a;
}

.reload-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.error-state {
    text-align: center;
    padding: 4rem 2rem;
}

.error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.error-state h3 {
    color: #ff6b6b;
    margin-bottom: 0.5rem;
}

.error-state p {
    color: #8b9aab;
    margin-bottom: 0.5rem;
}

.retry-btn {
    background: #66c0f4;
    color: #1a2a3a;
    border: none;
    padding: 0.7rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    margin-top: 1rem;
}

.retry-btn:hover {
    background: #1a9fff;
    transform: scale(1.05);
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.empty-state h3 {
    color: #e0e0e0;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #8b9aab;
    margin-bottom: 1rem;
}

.steam-store-btn {
    background: #66c0f4;
    color: #1a2a3a;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.steam-store-btn:hover {
    background: #1a9fff;
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .header-actions {
        margin-left: 0;
        width: 100%;
    }

    .header-actions button {
        flex: 1;
    }
}
</style>