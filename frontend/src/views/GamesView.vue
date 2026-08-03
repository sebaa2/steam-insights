<!-- src/views/GamesView.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useGames } from '@/composables/useGames'
import { usePagination } from '@/composables/usePagination'

import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'

import GameCard from '@/components/games/GameCard.vue'
import GamesPagination from '@/components/games/GamesPagination.vue'

import { useGameFilters } from '@/composables/useGameFilters'
import GameFilters from '@/components/games/GameFilters.vue'

const router = useRouter()

const {
  games,
  loading,
  error,
  stats,
  openGame,
  reloadGames
} = useGames()

const {
  search,
  sort,
  status,
  filteredGames
} = useGameFilters(games)

const {
  currentPage,
  totalPages,
  paginatedItems,
  goToPage
} = usePagination(filteredGames, 20)

// ✅ Función para manejar la navegación a logros
const handleAchievements = (game) => {
  console.log('🏆 Abriendo logros para:', game.name, 'App ID:', game.id)

  // ✅ Pasar el nombre del juego como query param o state
  router.push({
    name: 'achievements',
    params: { appId: game.id },
    query: { gameName: game.name } // ✅ Pasar el nombre en la URL
  })
}
</script>

<template>
  <div class="games-view">

    <LoadingOverlay :show="loading">
      <h2>Cargando biblioteca de juegos...</h2>
      <p>Obteniendo tu lista de juegos desde Steam</p>
    </LoadingOverlay>

    <div class="view-header">

      <button class="back-btn" @click="$router.back()">
        ← Volver
      </button>

      <h1>Biblioteca de juegos</h1>

      <span v-if="!error && games.length" class="total-games">
        {{ stats.total }} juegos
        <span v-if="stats.played > 0">
          ({{ stats.played }} jugados)
        </span>
      </span>

      <button class="reload-btn" @click="reloadGames">
        ⟳ Recargar
      </button>

    </div>

    <!-- Error -->

    <ErrorState v-if="error && !loading" :message="error" @retry="reloadGames" />

    <!-- Sin juegos -->

    <EmptyState v-else-if="!loading && games.length === 0" />

    <!-- Biblioteca -->

    <div v-else-if="!loading && games.length > 0" class="games-container">

      <GameFilters v-model:search="search" v-model:sort="sort" v-model:status="status" />

      <div class="games-grid">

        <GameCard v-for="game in paginatedItems" :key="game.id" :game="game" @open="openGame"
          @achievements="handleAchievements" />

      </div>

      <GamesPagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />

    </div>

  </div>
</template>

<style scoped src="@/styles/games-view.css"></style>