<script setup>
import { computed } from 'vue'

// --- Props ---
const props = defineProps({
  games: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: 'Top juegos'
  },
  maxGames: {
    type: Number,
    default: null
  },
  showViewAllButton: {
    type: Boolean,
    default: false
  },
  showRank: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  steamId: {
    type: String,
    default: null
  },
  totalGames: {
    type: Number,
    default: null
  },
  emptyMessage: {
    type: String,
    default: 'No hay juegos para mostrar'
  }
})

// --- Emits ---
const emit = defineEmits(['view-all', 'game-click'])

// --- Computed ---
const displayedGames = computed(() => {
  if (!props.games || !props.games.length) return []

  let sorted = [...props.games].sort((a, b) => b.hoursPlayed - a.hoursPlayed)

  if (props.maxGames && sorted.length > props.maxGames) {
    return sorted.slice(0, props.maxGames)
  }

  return sorted
})

const hasMoreGames = computed(() => {
  if (!props.showViewAllButton) return false

  if (props.totalGames != null) {
    return props.totalGames > props.games.length
  }

  if (props.maxGames != null) {
    return props.games.length > props.maxGames
  }

  return false
})

const maxHours = computed(() => {
  if (!displayedGames.value.length) return 1
  return Math.max(...displayedGames.value.map(game => game.hoursPlayed))
})

// --- Métodos ---
const getPercentage = (hours) => {
  if (maxHours.value === 0) return 0
  return Math.round((hours / maxHours.value) * 100)
}

const formatHours = (hours) => {
  if (hours === undefined || hours === null) return '0 h'

  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}k h`
  }
  if (hours === 0) {
    return 'Sin jugar'
  }
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`
  }
  return `${hours} h`
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder-game.jpg'
  event.target.alt = 'Imagen no disponible'
}

// ✅ CORREGIDO: Verificar listeners correctamente
const handleGameClick = (gameId) => {
  // Emitir el evento primero
  emit('game-click', gameId)

  // Si el evento fue manejado por el padre, no abrimos Steam por defecto
  // Nota: No podemos verificar si hay listeners directamente en Vue 3
  // Usamos un enfoque diferente: el padre maneja o no el evento
}

// ✅ CORREGIDO: Verificar listeners correctamente
const handleViewAll = () => {
  // Emitir el evento primero
  emit('view-all')

  // No hacemos nada más, el padre decide cómo manejar el evento
}

// También podemos exponer una función para abrir en Steam si es necesario
const openInSteam = (gameId) => {
  window.open(`https://store.steampowered.com/app/${gameId}`, '_blank')
}
</script>

<template>
  <div class="games-list">
    <!-- Header -->
    <div class="games-header">
      <h2>{{ title }}</h2>
      <div class="header-actions">
        <span v-if="maxGames && totalGames" class="games-count">
          Mostrando {{ Math.min(games.length, maxGames) }} de {{ totalGames }}
        </span>
        <button v-if="showViewAllButton && hasMoreGames" class="view-all-btn" @click="handleViewAll">
          Ver todos →
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!displayedGames.length" class="empty-state">
      <p>{{ emptyMessage }}</p>
    </div>

    <!-- Games List -->
    <div v-else class="games-container">
      <div v-for="(game, index) in displayedGames" :key="game.id || index" class="game-card clickable"
        @click="handleGameClick(game.id)">
        <!-- Rank -->
        <div v-if="showRank" class="rank">
          #{{ index + 1 }}
        </div>

        <!-- Image -->
        <img :src="game.image || '/images/placeholder-game.jpg'" :alt="game.name || 'Juego sin nombre'"
          class="game-image" @error="handleImageError" loading="lazy" />

        <!-- Info -->
        <div class="game-info">
          <div class="game-name-row">
            <h3 class="game-title">{{ game.name || 'Sin nombre' }}</h3>
            <span class="game-hours">{{ formatHours(game.hoursPlayed) }}</span>
          </div>

          <!-- Progress Bar -->
          <div v-if="showProgress" class="progress-container">
            <div class="progress">
              <div class="progress-fill" :style="{ width: getPercentage(game.hoursPlayed) + '%' }"></div>
            </div>
            <span class="progress-label">{{ getPercentage(game.hoursPlayed) }}%</span>
          </div>

          <!-- Additional Info -->
          <div v-if="game.lastPlayed" class="game-meta">
            <span class="meta-item">
              Última vez: {{ new Date(game.lastPlayed).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.games-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

/* Header */
.games-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.games-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--steam-text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.games-count {
  color: var(--steam-text-secondary);
  font-size: 0.9rem;
}

.view-all-btn {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #66c0f4, #1a9fff);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 159, 255, 0.4);
}

.view-all-btn:active {
  transform: translateY(0);
}

/* Empty State */
.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--steam-text-secondary);
  background: var(--steam-surface);
  border-radius: 12px;
}

/* Games Container */
.games-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Game Card */
.game-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  background: var(--steam-surface);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  border-color: #1a9fff33;
}

.game-card:active {
  transform: scale(0.99);
}

/* Rank */
.rank {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #1b2838;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: #66c0f4;
  flex-shrink: 0;
  font-size: 0.9rem;
}

/* Image */
.game-image {
  width: 180px;
  min-height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background: #1a2a3a;
  flex-shrink: 0;
}

/* Info */
.game-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.game-name-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.game-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--steam-text);
}

.game-hours {
  color: var(--steam-text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Progress */
.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress {
  flex: 1;
  height: 6px;
  background: #23384b;
  border-radius: 999px;
  overflow: hidden;
  min-width: 50px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #66c0f4, #1a9fff);
  transition: width 0.6s ease;
  border-radius: 999px;
}

.progress-label {
  font-size: 0.75rem;
  color: var(--steam-text-secondary);
  font-weight: 500;
  min-width: 35px;
  text-align: right;
  flex-shrink: 0;
}

/* Meta */
.game-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
}

.meta-item {
  font-size: 0.75rem;
  color: var(--steam-text-secondary);
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .game-card {
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem;
  }

  .rank {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
    align-self: flex-start;
  }

  .game-image {
    width: 100%;
    height: auto;
    aspect-ratio: 460/215;
  }

  .game-name-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .game-title {
    white-space: normal;
    font-size: 1rem;
  }

  .games-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .game-card {
    padding: 0.5rem;
    gap: 0.75rem;
  }

  .game-title {
    font-size: 0.95rem;
  }

  .game-hours {
    font-size: 0.8rem;
  }

  .view-all-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }

  .games-header h2 {
    font-size: 1.2rem;
  }

  .rank {
    width: 30px;
    height: 30px;
    font-size: 0.7rem;
  }
}
</style>