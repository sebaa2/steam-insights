<!-- src/components/games/GameCard.vue -->
<script setup>
import GameActions from './GameActions.vue'

const props = defineProps({
    game: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['open', 'achievements'])

const openGame = () => {
    emit('open', props.game.id)
}

// ✅ Pasar el nombre del juego junto con el ID
const openAchievements = (game) => {
    emit('achievements', {
        id: game.id,
        name: game.name // ✅ Enviar el nombre
    })
}

const formatHours = (hours) => {
    if (!hours) return '0 hrs'
    const rounded = Math.round(hours * 10) / 10
    return rounded >= 1 ? `${rounded} hrs` : `${Math.round(rounded * 60)} min`
}

const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/460x215/1a2a3a/66c0f4?text=No+Image'
}

const progressWidth = Math.min((props.game.hoursPlayed / 100) * 100, 100)
</script>

<template>
    <div class="game-card">
        <div class="image-container">
            <img :src="game.image" :alt="game.name" class="game-image" @error="handleImageError">
            <GameActions :game="game" @achievements="openAchievements" />
        </div>
        <div class="game-details" @click="openGame">
            <h3 class="game-name">{{ game.name }}</h3>
            <p class="game-hours">{{ formatHours(game.hoursPlayed) }}</p>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressWidth + '%' }" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.game-card {
    background: #1a2a3a;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #2a3f52;
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.game-card:hover {
    transform: translateY(-4px);
    border-color: #66c0f4;
}

.image-container {
    position: relative;
    overflow: hidden;
}

.game-image {
    width: 100%;
    height: auto;
    aspect-ratio: 460/215;
    object-fit: cover;
    background: #0a1a2a;
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
    color: #e0e0e0;
}

.game-hours {
    margin: 0 0 0.5rem 0;
    color: #8b9aab;
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

.image-container:hover .game-image {
    transform: scale(1.05);
}
</style>