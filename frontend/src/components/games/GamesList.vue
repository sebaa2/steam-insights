<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  games: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Top juegos'
  },
  limit: {
    type: Number,
    default: null
  },
  showViewAllButton: {
    type: Boolean,
    default: false
  },
  steamId: {
    type: String,
    default: null
  },
  totalGames: {
    type: Number,
    default: null
  }
})

// Ordenar juegos por horas jugadas (mayor a menor)
const displayedGames = computed(() => {
  const sortedGames = [...props.games].sort((a, b) => b.hoursPlayed - a.hoursPlayed)

  if (props.limit && sortedGames.length > props.limit) {
    return sortedGames.slice(0, props.limit)
  }

  return sortedGames
})

const hasMoreGames = computed(() => {
  if (!props.showViewAllButton) return false

  if (props.totalGames != null) {
    return props.totalGames > props.games.length
  }

  if (props.limit != null) {
    return props.games.length > props.limit
  }

  return false
})

const maxHours = computed(() => {
  if (!displayedGames.value.length) return 1
  return Math.max(...displayedGames.value.map(game => game.hoursPlayed))
})

const getPercentage = (hours) => {
  return Math.round((hours / maxHours.value) * 100)
}

const formatHours = (hours) => {
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

const goToAllGames = () => {
  if (props.steamId) {
    router.push(`/games/${props.steamId}`)
  } else {
    const savedId = localStorage.getItem('steamId')
    if (savedId) {
      router.push(`/games/${savedId}`)
    } else {
      router.push('/games')
    }
  }
}

const openGame = (gameId) => {
  window.open(
    `https://store.steampowered.com/app/${gameId}`,
    '_blank'
  )
}
</script>

<template>
  <div class="games-list">
    <div class="games-header">
      <h2>{{ title }}</h2>
      <div class="header-actions">
        <span v-if="limit && totalGames" class="games-count">
          Mostrando {{ games.length }} de {{ totalGames }}
        </span>
        <button v-if="showViewAllButton && hasMoreGames" class="view-all-btn" @click="goToAllGames">
          Ver todos →
        </button>
      </div>
    </div>

    <div v-if="!displayedGames.length" class="empty-state">
      <p>No hay juegos para mostrar</p>
    </div>

    <div v-for="(game, index) in displayedGames" :key="game.id" class="game-card clickable" @click="openGame(game.id)">
      <div class="rank">
        #{{ index + 1 }}
      </div>

      <img :src="game.image" :alt="game.name" class="game-image" @error="handleImageError" loading="lazy">

      <div class="game-info">
        <div class="game-name-row">
          <h3 class="game-title">{{ game.name }}

            <span class="external-link"> </span>
          </h3>
          <span class="game-hours">{{ formatHours(game.hoursPlayed) }}</span>
        </div>

        <div class="progress-container">
          <div class="progress">
            <div class="progress-fill" :style="{ width: getPercentage(game.hoursPlayed) + '%' }"></div>
          </div>
          <span class="progress-label">{{ getPercentage(game.hoursPlayed) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.games-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.games-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
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

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--steam-text-secondary);
  background: var(--steam-surface);
  border-radius: 12px;
}

.game-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  background: var(--steam-surface);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  border-color: #1a9fff33;
}

.game-image {
  width: 180px;
  min-height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background: #1a2a3a;
  flex-shrink: 0;
}

.game-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  font-size: 1.2rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--steam-text);
}

.game-hours {
  color: var(--steam-text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress {
  flex: 1;
  height: 8px;
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

/* Responsive */
@media (max-width: 768px) {
  .game-card {
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem;
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
    font-size: 1.1rem;
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
  }

  .game-title {
    font-size: 1rem;
  }

  .game-hours {
    font-size: 0.85rem;
  }

  .view-all-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
}

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

}

.external-link {
  font-size: .8rem;

  color: #66c0f4;

  margin-left: .35rem;

  opacity: .75;
}
</style>