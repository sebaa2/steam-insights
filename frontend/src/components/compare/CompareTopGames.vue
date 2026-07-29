<script setup>
const props = defineProps({
    games: {
        type: Array,
        default: () => []
    },
    leftName: {
        type: String,
        default: 'Jugador A'
    },
    rightName: {
        type: String,
        default: 'Jugador B'
    }
})

const formatHours = (hours) => {
    if (!hours) return '0 h'

    if (hours >= 1000) {
        return `${(hours / 1000).toFixed(1)}k h`
    }

    return `${hours.toFixed(1)} h`
}
</script>

<template>
    <section class="compare-section">
        <h2>🏆 Comparación del Top 5</h2>

        <div v-if="!games.length" class="empty">
            No hay información disponible.
        </div>

        <div v-for="game in games" :key="game.left.id" class="game-card">
            <img :src="game.left.image" :alt="game.left.name" />

            <div class="game-info">

                <h3>{{ game.left.name }}</h3>

                <div class="comparison-row">

                    <div class="player">
                        <strong>{{ leftName }}</strong>

                        <span>
                            {{ formatHours(game.left.hoursPlayed) }}
                        </span>
                    </div>

                    <div class="player">
                        <strong>{{ rightName }}</strong>

                        <span v-if="game.right">
                            {{ formatHours(game.right.hoursPlayed) }}
                        </span>

                        <span v-else class="missing">
                            No está en su Top 5
                        </span>
                    </div>

                </div>

            </div>
        </div>

    </section>
</template>

<style scoped>
.compare-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}

.game-card {
    display: flex;
    gap: 1rem;
    background: var(--steam-surface);
    padding: 1rem;
    border-radius: 12px;
    align-items: center;
}

img {
    width: 180px;
    border-radius: 8px;
}

.game-info {
    flex: 1;
}

.comparison-row {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    gap: 2rem;
}

.player {
    display: flex;
    flex-direction: column;
    gap: .25rem;
}

.missing {
    color: #ff6b6b;
}

@media (max-width:768px) {
    .game-card {
        flex-direction: column;
    }

    .comparison-row {
        flex-direction: column;
    }

    img {
        width: 100%;
    }
}
</style>