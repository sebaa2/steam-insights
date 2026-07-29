<script setup>
const props = defineProps({
    left: {
        type: Object,
        required: true
    },
    right: {
        type: Object,
        required: true
    }
})

const winner = (leftValue, rightValue, reverse = false) => {

    if (leftValue === rightValue) {
        return 'Empate'
    }

    if (reverse) {
        return leftValue < rightValue ? 'left' : 'right'
    }

    return leftValue > rightValue ? 'left' : 'right'
}
</script>

<template>

    <div class="compare-stats">

        <table>

            <thead>

                <tr>

                    <th>Estadística</th>

                    <th>{{ left.profile.name }}</th>

                    <th>{{ right.profile.name }}</th>

                    <th>Ganador</th>

                </tr>

            </thead>

            <tbody>

                <tr>

                    <td>Total juegos</td>

                    <td>{{ left.library.totalGames }}</td>

                    <td>{{ right.library.totalGames }}</td>

                    <td>

                        <span v-if="winner(left.library.totalGames, right.library.totalGames) == 'left'">

                            🏆 {{ left.profile.name }}

                        </span>

                        <span v-else-if="winner(left.library.totalGames, right.library.totalGames) == 'right'">

                            🏆 {{ right.profile.name }}

                        </span>

                        <span v-else>

                            Empate

                        </span>

                    </td>

                </tr>

                <tr>

                    <td>Horas jugadas</td>

                    <td>{{ left.stats.totalHours }}</td>

                    <td>{{ right.stats.totalHours }}</td>

                    <td>

                        <span v-if="winner(left.stats.totalHours, right.stats.totalHours) == 'left'">

                            🏆 {{ left.profile.name }}

                        </span>

                        <span v-else-if="winner(left.stats.totalHours, right.stats.totalHours) == 'right'">

                            🏆 {{ right.profile.name }}

                        </span>

                        <span v-else>

                            Empate

                        </span>

                    </td>

                </tr>

                <tr>

                    <td>Promedio</td>

                    <td>{{ left.stats.averageHours }}</td>

                    <td>{{ right.stats.averageHours }}</td>

                    <td>

                        <span v-if="winner(left.stats.averageHours, right.stats.averageHours) == 'left'">

                            🏆 {{ left.profile.name }}

                        </span>

                        <span v-else-if="winner(left.stats.averageHours, right.stats.averageHours) == 'right'">

                            🏆 {{ right.profile.name }}

                        </span>

                        <span v-else>

                            Empate

                        </span>

                    </td>

                </tr>

                <tr>

                    <td>Sin jugar</td>

                    <td>{{ left.stats.neverPlayed }}</td>

                    <td>{{ right.stats.neverPlayed }}</td>

                    <td>

                        <span v-if="winner(left.stats.neverPlayed, right.stats.neverPlayed, true) == 'left'">

                            🏆 {{ left.profile.name }}

                        </span>

                        <span v-else-if="winner(left.stats.neverPlayed, right.stats.neverPlayed, true) == 'right'">

                            🏆 {{ right.profile.name }}

                        </span>

                        <span v-else>

                            Empate

                        </span>

                    </td>

                </tr>

                <tr>

                    <td>Completitud</td>

                    <td>{{ left.stats.completion }}%</td>

                    <td>{{ right.stats.completion }}%</td>

                    <td>

                        <span v-if="winner(left.stats.completion, right.stats.completion) == 'left'">

                            🏆 {{ left.profile.name }}

                        </span>

                        <span v-else-if="winner(left.stats.completion, right.stats.completion) == 'right'">

                            🏆 {{ right.profile.name }}

                        </span>

                        <span v-else>

                            Empate

                        </span>

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</template>

<style scoped>
.compare-stats {

    margin-top: 2rem;

    overflow-x: auto;

}

table {

    width: 100%;

    border-collapse: collapse;

    background: var(--steam-surface);

    border-radius: 12px;

    overflow: hidden;

}

th {

    background: #1b2838;

    padding: 1rem;

}

td {

    padding: 1rem;

    text-align: center;

    border-top: 1px solid rgba(255, 255, 255, .05);

}

tbody tr:hover {

    background: rgba(102, 192, 244, .08);

}
</style>