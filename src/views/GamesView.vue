<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { getOwnedGames } from '@/services/steamService'
import { useProfileStore } from '@/stores/profileStore'

const route = useRoute()
const profileStore = useProfileStore()

const steamId = ref(route.params.steamId || '')
const games = ref([])
const loading = ref(false)

const searchQuery = ref('')
const sortBy = ref('hoursPlayed')
const filterUnplayed = ref(false)

// Juegos filtrados y ordenados
const filteredGames = computed(() => {
  let result = [...games.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()

    result = result.filter(game =>
      game.name.toLowerCase().includes(query)
    )
  }

  if (filterUnplayed.value) {
    result = result.filter(game => game.hoursPlayed > 0)
  }

  result.sort((a, b) => {
    if (sortBy.value === 'hoursPlayed') {
      return b.hoursPlayed - a.hoursPlayed
    }

    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    }

    if (sortBy.value === 'minutesPlayed') {
      return b.minutesPlayed - a.minutesPlayed
    }

    return 0
  })

  return result
})

// Estadísticas
const stats = computed(() => {
  if (!games.value.length) {
    return {
      total: 0,
      played: 0,
      unplayed: 0
    }
  }

  const total = games.value.length

  const unplayed = games.value.filter(
    game => game.hoursPlayed === 0
  ).length

  return {
    total,
    played: total - unplayed,
    unplayed
  }
})

// Cargar juegos
const loadGames = async () => {

  if (!steamId.value) {

    steamId.value = profileStore.profile?.steamId

    if (!steamId.value) {
      return
    }

  }

  loading.value = true

  try {

    const response = await getOwnedGames(steamId.value)

    games.value = response.library.games || []

  } catch (error) {

    console.error('Error al cargar juegos:', error)

  } finally {

    loading.value = false

  }

}

// Formatear horas
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

// Imagen no disponible
const handleImageError = (event) => {

  event.target.src = '/images/placeholder-game.jpg'

}

// Abrir Steam
const openGame = (id) => {

  window.open(
    `https://store.steampowered.com/app/${id}`,
    '_blank'
  )

}

// Volver
const goBack = () => {

  window.history.back()

}

onMounted(() => {

  if (route.params.steamId) {
    steamId.value = route.params.steamId
  }

  loadGames()

})
</script>

<template>
  <div class="games-view">

    <div class="view-header">

      <button class="back-btn" @click="goBack">
        ← Volver
      </button>

      <h1>Biblioteca de juegos</h1>

      <span class="total-games">
        {{ stats.total }} juegos
      </span>

    </div>

    <div class="toolbar">

      <div class="search-box">

        <input v-model="searchQuery" type="text" placeholder="🔍 Buscar juegos..." class="search-input">

      </div>

      <div class="filters">

        <select v-model="sortBy" class="filter-select">
          <option value="hoursPlayed">
            Más jugados
          </option>

          <option value="name">
            Nombre
          </option>

          <option value="minutesPlayed">
            Tiempo total
          </option>

        </select>

        <label class="filter-checkbox">

          <input v-model="filterUnplayed" type="checkbox">

          Solo jugados

        </label>

      </div>

    </div>

    <div v-if="loading" class="loading">

      <p>Cargando juegos...</p>

    </div>

    <div v-else-if="filteredGames.length" class="games-grid">

      <div v-for="game in filteredGames" :key="game.id" class="game-card" @click="openGame(game.id)">

        <img :src="game.image" :alt="game.name" class="game-image" @error="handleImageError" loading="lazy">

        <div class="game-details">

          <h3 class="game-name">
            {{ game.name }}
          </h3>

          <p class="game-hours">
            {{ formatHours(game.hoursPlayed) }}
          </p>

          <div class="progress-bar">

            <div class="progress-fill" :style="{
              width: Math.min((game.hoursPlayed / 100) * 100, 100) + '%'
            }" />

          </div>

        </div>

      </div>

    </div>

    <div v-else class="empty-state">

      <p>No se encontraron juegos</p>

      <p class="empty-hint">
        {{ searchQuery ? 'Prueba con otra búsqueda' : 'No hay juegos en esta biblioteca' }}
      </p>

    </div>

  </div>
</template>

<style scoped>
.games-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.back-btn {
  padding: 0.5rem 1.25rem;
  background: var(--steam-surface);
  color: var(--steam-text);
  border: 1px solid #2a3f52;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #2a3f52;
  transform: translateX(-2px);
}

.view-header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.total-games {
  color: var(--steam-text-secondary);
  font-size: 1rem;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--steam-surface);
  color: var(--steam-text);
  border: 1px solid #2a3f52;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #66c0f4;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: var(--steam-surface);
  color: var(--steam-text);
  border: 1px solid #2a3f52;
  border-radius: 8px;
  cursor: pointer;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--steam-text-secondary);
  cursor: pointer;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.game-card {
  background: var(--steam-surface);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.game-image {
  width: 100%;
  height: auto;
  aspect-ratio: 460/215;
  object-fit: cover;
  background: #1a2a3a;
}

.game-details {
  padding: 1rem;
}

.game-name {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-hours {
  margin: 0 0 0.5rem 0;
  color: var(--steam-text-secondary);
  font-size: 0.9rem;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #23384b;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #66c0f4, #1a9fff);
  transition: width 0.3s ease;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--steam-text-secondary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--steam-text-secondary);
}

.empty-hint {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .games-view {
    padding: 1rem;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    flex-wrap: wrap;
  }

  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>