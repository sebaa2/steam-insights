<!-- components/achievements/AchievementsList.vue -->
<script setup>
import AchievementCard from './AchievementCard.vue'

defineProps({
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

const emit = defineEmits(['openStore'])
</script>

<template>
    <div class="content">
        <!-- Información del juego -->
        <div class="game-info">
            <div class="game-header">
                <div>
                    <h2>{{ achievementsData.gameName || 'Juego Desconocido' }}</h2>
                    <p class="app-id">Steam App ID: {{ achievementsData.appId }}</p>
                </div>
                <button @click="emit('openStore')" class="steam-store-btn">
                    🔗 Ver en Steam
                </button>
            </div>

            <!-- Estado del usuario -->
            <div v-if="achievementsData.hasUserData" class="user-status">
                <span class="badge success">✅ Mostrando tu progreso</span>
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
            <button class="filter-btn active">Todos ({{ stats.total }})</button>
            <button v-if="achievementsData.hasUserData" class="filter-btn">
                ✅ Conseguidos ({{ stats.achieved }})
            </button>
            <button v-if="achievementsData.hasUserData" class="filter-btn">
                🔒 Pendientes ({{ stats.total - stats.achieved }})
            </button>
        </div>

        <!-- Grid de logros -->
        <div class="achievements-grid">
            <AchievementCard v-for="(achievement, index) in achievementsData.achievements"
                :key="achievement.name || index" :achievement="achievement" />
        </div>

        <!-- Footer -->
        <div class="footer-stats">
            <span>Total: {{ achievementsData.totalAchievements }} logros</span>
            <span v-if="achievementsData.hasUserData">
                • Progreso: {{ stats.achieved }}/{{ stats.total }} ({{ stats.percentage }}%)
            </span>
            <span v-else>• Inicia sesión para ver tu progreso</span>
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

.game-header h2 {
    margin: 0 0 0.3rem 0;
    color: #66c0f4;
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
}

.filter-btn:hover {
    border-color: #66c0f4;
}

.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
}

.footer-stats {
    text-align: center;
    color: #8b9aab;
    padding: 1rem;
    border-top: 1px solid #2a3f52;
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
}
</style>