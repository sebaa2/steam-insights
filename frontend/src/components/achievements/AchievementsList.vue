<!-- components/achievements/AchievementsList.vue -->
<script setup>
import { ref, computed } from 'vue'
import AchievementCard from './AchievementCard.vue'

const props = defineProps({
    achievementsData: {
        type: Object,
        required: true
    },
    stats: {
        type: Object,
        required: true
    },
    username: String,
    isLoggedIn: Boolean
})

const emit = defineEmits(['openStore', 'debugClick'])

// Estado del filtro activo
const activeFilter = ref('all')
const clickCount = ref(0)
let clickTimeout = null

// Logros filtrados según el filtro activo
const filteredAchievements = computed(() => {
    if (!props.achievementsData?.achievements) return []

    switch (activeFilter.value) {
        case 'achieved':
            return props.achievementsData.achievements.filter(a => a.achieved === true)
        case 'locked':
            return props.achievementsData.achievements.filter(a => a.achieved === false)
        case 'all':
        default:
            return props.achievementsData.achievements
    }
})

// Contadores para cada filtro
const counts = computed(() => {
    const all = props.achievementsData?.achievements?.length || 0
    const achieved = props.achievementsData?.achievements?.filter(a => a.achieved === true).length || 0
    const locked = props.achievementsData?.achievements?.filter(a => a.achieved === false).length || 0
    return { all, achieved, locked }
})

// Cambiar filtro
const setFilter = (filter) => {
    activeFilter.value = filter
}

const handleDebugClick = () => {
    clickCount.value++
    console.log(`🖱️ Clic en progreso: ${clickCount.value}/3`)

    // Feedback visual
    const badge = document.querySelector('.debug-click-target')
    if (badge) {
        badge.style.transform = 'scale(1.1)'
        setTimeout(() => {
            badge.style.transform = 'scale(1)'
        }, 200)
    }

    clearTimeout(clickTimeout)
    clickTimeout = setTimeout(() => {
        clickCount.value = 0
        console.log('🔄 Resetear contador de clics')
    }, 2000)

    if (clickCount.value >= 3) {
        console.log('🎉 ¡3 clics detectados! Activando debug...')
        clickCount.value = 0
        emit('debugClick')
    }
}
</script>

<template>
    <div class="content">
        <!-- Información del juego -->
        <div class="game-info">
            <div class="game-header">
                <div>
                    <h2 class="game-title">
                        <span class="game-icon">🎮</span>
                        {{ achievementsData.gameName || 'Juego Desconocido' }}
                    </h2>
                    <p class="app-id">Steam App ID: {{ achievementsData.appId }}</p>
                </div>
                <button @click="emit('openStore')" class="steam-store-btn">
                    🔗 Ver en Steam
                </button>
            </div>

            <!-- Estado del usuario - -->
            <div v-if="achievementsData.hasUserData" class="user-status">
                <span class="badge success debug-click-target" @click="handleDebugClick"
                    style="cursor: pointer; user-select: none; transition: transform 0.2s ease;"
                    title="Haz clic 3 veces para activar debug">
                    ✅ Mostrando tu progreso <span style="font-size: 0.7rem; opacity: 0.5;"></span>
                </span>
                <span class="stats-badge">
                    {{ stats.achieved }} / {{ stats.total }} logros ({{ stats.percentage }}%)
                </span>
                <span v-if="username" class="user-name-badge">👤 {{ username }}</span>
            </div>
            <div v-else-if="isLoggedIn" class="user-status">
                <span class="badge warning">⚠️ No se pudo obtener tu progreso</span>
                <span class="stats-badge">Intenta nuevamente</span>
            </div>
            <div v-else class="user-status">
                <span class="badge info">ℹ️ Inicia sesión para ver tu progreso</span>
            </div>
        </div>

        <!-- Barra de progreso -->
        <div v-if="achievementsData.hasUserData" class="progress-container">
            <div class="progress-label">
                <span>Progreso total</span>
                <span>{{ stats.percentage }}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: stats.percentage + '%' }"></div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filters">
            <button class="filter-btn" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">
                📊 Todos ({{ counts.all }})
            </button>
            <button v-if="achievementsData.hasUserData" class="filter-btn"
                :class="{ active: activeFilter === 'achieved' }" @click="setFilter('achieved')">
                ✅ Conseguidos ({{ counts.achieved }})
            </button>
            <button v-if="achievementsData.hasUserData" class="filter-btn"
                :class="{ active: activeFilter === 'locked' }" @click="setFilter('locked')">
                🔒 Pendientes ({{ counts.locked }})
            </button>

            <span v-if="activeFilter !== 'all'" class="filter-active-indicator">
                Mostrando: {{ activeFilter === 'achieved' ? 'Conseguidos' : 'Pendientes' }}
                <button @click="setFilter('all')" class="clear-filter">✕</button>
            </span>
        </div>

        <!-- Grid de logros -->
        <div class="achievements-grid">
            <AchievementCard v-for="(achievement, index) in filteredAchievements" :key="achievement.name || index"
                :achievement="achievement" />
        </div>

        <div v-if="filteredAchievements.length === 0" class="empty-filter-message">
            <span>🎯 No hay logros que coincidan con este filtro</span>
            <button @click="setFilter('all')" class="clear-filter-btn">Ver todos</button>
        </div>

        <!-- Footer -->
        <div class="footer-stats">
            <span>Total: {{ achievementsData.totalAchievements }} logros</span>
            <span v-if="achievementsData.hasUserData">
                • Progreso: {{ stats.achieved }}/{{ stats.total }} ({{ stats.percentage }}%)
            </span>
            <span v-else>• Inicia sesión para ver tu progreso</span>
            <span v-if="activeFilter !== 'all'" class="footer-filter-info">
                • Filtro: {{ activeFilter === 'achieved' ? 'Conseguidos' : 'Pendientes' }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.game-info {
    background: #1a2a3a;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #2a3f52;
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
}

.game-title {
    margin: 0 0 0.3rem 0;
    color: #66c0f4;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.game-icon {
    font-size: 1.5rem;
}

.app-id {
    color: #8b9aab;
    margin: 0;
    font-size: 0.9rem;
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
    white-space: nowrap;
}

.steam-store-btn:hover {
    background: #1a9fff;
    transform: scale(1.05);
}

.user-status {
    margin-top: 1rem;
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    align-items: center;
}

.badge {
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    transition: transform 0.2s ease;
}

.badge.success {
    background: #1b5e20;
    color: #81c784;
}

.badge.warning {
    background: #4a3a1a;
    color: #ffd700;
}

.badge.info {
    background: #1a2a4a;
    color: #66c0f4;
}

.stats-badge {
    background: #1a2a4a;
    color: #66c0f4;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
}

.user-name-badge {
    background: #2a3f52;
    color: #e0e0e0;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
}

.progress-container {
    background: #1a2a3a;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #2a3f52;
}

.progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #e0e0e0;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #2a3f52;
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #66c0f4, #1a9fff);
    transition: width 0.5s ease;
}

.filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
}

.filter-btn {
    background: #1a2a3a;
    color: #8b9aab;
    border: 1px solid #2a3f52;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.filter-btn.active {
    background: #2a3f52;
    color: #e0e0e0;
    border-color: #66c0f4;
    box-shadow: 0 0 15px rgba(102, 192, 244, 0.1);
}

.filter-btn:hover:not(.active) {
    border-color: #66c0f4;
    color: #e0e0e0;
}

.filter-active-indicator {
    background: rgba(102, 192, 244, 0.1);
    color: #66c0f4;
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid rgba(102, 192, 244, 0.2);
}

.clear-filter {
    background: transparent;
    border: none;
    color: #8b9aab;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0 0.3rem;
}

.clear-filter:hover {
    color: #e0e0e0;
}

.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
}

.empty-filter-message {
    text-align: center;
    padding: 2rem;
    color: #8b9aab;
    background: #1a2a3a;
    border-radius: 8px;
    border: 1px dashed #2a3f52;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.clear-filter-btn {
    background: #2a3f52;
    color: #e0e0e0;
    border: none;
    padding: 0.3rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
}

.clear-filter-btn:hover {
    background: #3a5a6a;
}

.footer-stats {
    text-align: center;
    color: #8b9aab;
    padding: 1rem;
    border-top: 1px solid #2a3f52;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.footer-filter-info {
    color: #66c0f4;
    font-weight: 500;
}

@media (max-width: 768px) {
    .achievements-grid {
        grid-template-columns: 1fr;
    }

    .game-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .steam-store-btn {
        width: 100%;
        text-align: center;
    }

    .filters {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-btn {
        text-align: center;
    }

    .footer-stats {
        flex-direction: column;
        gap: 0.3rem;
    }
}
</style>