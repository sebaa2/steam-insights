<script setup>

defineProps({

    games: {
        type: Array,
        default: () => []
    },

    similarity: {
        type: [Number, String],
        default: 0
    }

})

const formatHours = (hours) => {

    if (hours >= 1000) {

        return `${(hours / 1000).toFixed(1)}k h`

    }

    return `${hours} h`

}

</script>

<template>

    <section class="compare-section">

        <h2>

            🎮 Juegos en común

        </h2>

        <div class="similarity">

            Coincidencia de biblioteca

            <strong>

                {{ similarity }}%

            </strong>

        </div>

        <div v-if="!games.length" class="empty">

            No poseen juegos en común.

        </div>

        <div v-for="game in games" :key="game.left.id" class="game-card">

            <img :src="game.left.image" :alt="game.left.name">

            <div class="game-info">

                <h3>

                    {{ game.left.name }}

                </h3>

                <div class="comparison-row">

                    <div class="player">

                        <strong>

                            Jugador A

                        </strong>

                        <span>

                            {{ formatHours(game.left.hoursPlayed) }}

                        </span>

                    </div>

                    <div class="player">

                        <strong>

                            Jugador B

                        </strong>

                        <span>

                            {{ formatHours(game.right.hoursPlayed) }}

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

.similarity {

    padding: 1rem;

    background: #1b2838;

    border-radius: 10px;

    font-size: 1rem;

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

.empty {

    padding: 2rem;

    background: var(--steam-surface);

    border-radius: 12px;

    text-align: center;

    color: var(--steam-text-secondary);

}

@media(max-width:768px) {

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