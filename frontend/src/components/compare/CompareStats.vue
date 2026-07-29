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

// Formateadores para mostrar datos correctamente
const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0'
    return Math.round(value).toLocaleString()
}

const formatHours = (hours) => {
    if (hours === undefined || hours === null || isNaN(hours)) return '0h'
    if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k h`
    if (hours >= 10) return `${Math.round(hours)} h`
    return `${Math.round(hours * 10) / 10} h`
}

const formatAverage = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0h'
    return `${Math.round(value * 10) / 10} h`
}

const formatCompletion = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0%'
    return `${Math.round(value)}%`
}

const formatNeverPlayed = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0'
    return Math.round(value)
}
</script>

<template>
    <div class="compare-stats">
        <h3 class="stats-title">📊 Comparativa detallada</h3>

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
                    <td><strong>Total juegos</strong></td>
                    <td>{{ formatNumber(left.library.totalGames) }}</td>
                    <td>{{ formatNumber(right.library.totalGames) }}</td>
                    <td>
                        <span v-if="winner(left.library.totalGames, right.library.totalGames) == 'left'">
                            🏆 {{ left.profile.name }}
                        </span>
                        <span v-else-if="winner(left.library.totalGames, right.library.totalGames) == 'right'">
                            🏆 {{ right.profile.name }}
                        </span>
                        <span v-else>🤝 Empate</span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Horas jugadas</strong></td>
                    <td>{{ formatHours(left.stats.totalHours) }}</td>
                    <td>{{ formatHours(right.stats.totalHours) }}</td>
                    <td>
                        <span v-if="winner(left.stats.totalHours, right.stats.totalHours) == 'left'">
                            🏆 {{ left.profile.name }}
                        </span>
                        <span v-else-if="winner(left.stats.totalHours, right.stats.totalHours) == 'right'">
                            🏆 {{ right.profile.name }}
                        </span>
                        <span v-else>🤝 Empate</span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Promedio horas</strong></td>
                    <td>{{ formatAverage(left.stats.averageHours) }}</td>
                    <td>{{ formatAverage(right.stats.averageHours) }}</td>
                    <td>
                        <span v-if="winner(left.stats.averageHours, right.stats.averageHours) == 'left'">
                            🏆 {{ left.profile.name }}
                        </span>
                        <span v-else-if="winner(left.stats.averageHours, right.stats.averageHours) == 'right'">
                            🏆 {{ right.profile.name }}
                        </span>
                        <span v-else>🤝 Empate</span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Sin jugar</strong></td>
                    <td>{{ formatNeverPlayed(left.stats.neverPlayed) }}</td>
                    <td>{{ formatNeverPlayed(right.stats.neverPlayed) }}</td>
                    <td>
                        <span v-if="winner(left.stats.neverPlayed, right.stats.neverPlayed, true) == 'left'">
                            🏆 {{ left.profile.name }} <span class="hint">(menos)</span>
                        </span>
                        <span v-else-if="winner(left.stats.neverPlayed, right.stats.neverPlayed, true) == 'right'">
                            🏆 {{ right.profile.name }} <span class="hint">(menos)</span>
                        </span>
                        <span v-else>🤝 Empate</span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Completitud</strong></td>
                    <td>{{ formatCompletion(left.stats.completion) }}</td>
                    <td>{{ formatCompletion(right.stats.completion) }}</td>
                    <td>
                        <span v-if="winner(left.stats.completion, right.stats.completion) == 'left'">
                            🏆 {{ left.profile.name }}
                        </span>
                        <span v-else-if="winner(left.stats.completion, right.stats.completion) == 'right'">
                            🏆 {{ right.profile.name }}
                        </span>
                        <span v-else>🤝 Empate</span>
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

.stats-title {
    color: var(--steam-text);
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: var(--steam-surface);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

th {
    background: #1b2838;
    padding: 1rem;
    color: var(--steam-text);
    font-weight: 600;
    text-align: center;
    border-bottom: 2px solid rgba(102, 192, 244, 0.2);
}

td {
    padding: 1rem;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    color: var(--steam-text);
}

td:first-child {
    text-align: left;
    font-weight: 500;
    color: var(--steam-text-secondary);
}

tbody tr:hover {
    background: rgba(102, 192, 244, 0.05);
}

.hint {
    font-size: 0.7rem;
    opacity: 0.6;
    font-weight: normal;
}

@media (max-width: 768px) {

    th,
    td {
        padding: 0.75rem 0.5rem;
        font-size: 0.85rem;
    }

    td:first-child {
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {

    th,
    td {
        padding: 0.5rem 0.3rem;
        font-size: 0.75rem;
    }
}
</style>