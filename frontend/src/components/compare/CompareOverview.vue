<script setup>
import CompareBar from './CompareBar.vue'

const props = defineProps({
    comparison: {
        type: Object,
        required: true
    }
})

const formatHoursWithUnit = (hours) => {
    if (!hours || hours === 0) return '0 h'

    if (hours >= 1000)
        return `${(hours / 1000).toFixed(1)}k h`

    if (hours >= 10)
        return `${Math.round(hours)} h`

    return `${Math.round(hours * 10) / 10} h`
}

const formatHoursDiff = (left, right) => {
    const diff = left - right

    if (diff === 0)
        return 'Empate'

    const value = Math.abs(diff)

    const formatted =
        value >= 1000
            ? `${(value / 1000).toFixed(1)}k`
            : value >= 10
                ? Math.round(value)
                : Math.round(value * 10) / 10

    return diff > 0
        ? `+${formatted} h`
        : `-${formatted} h`
}
</script>

<template>

    <section class="overview">

        <h3>📊 Comparación general</h3>

        <CompareBar label="🎮 Juegos" :left-value="comparison.left.games" :right-value="comparison.right.games" />

        <CompareBar label="⏱️ Horas" :left-value="comparison.left.hours" :right-value="comparison.right.hours"
            :left-label="formatHoursWithUnit(comparison.left.hours)"
            :right-label="formatHoursWithUnit(comparison.right.hours)" :format-diff="formatHoursDiff"
            color-left="#66c0f4" color-right="#ff6b6b" />

        <CompareBar label="📈 Promedio" :left-value="comparison.left.average" :right-value="comparison.right.average" />

        <CompareBar label="🎯 Completitud" :left-value="comparison.left.completion"
            :right-value="comparison.right.completion" left-label="%" right-label="%" />

        <CompareBar label="📦 Sin jugar" :left-value="comparison.left.neverPlayed"
            :right-value="comparison.right.neverPlayed" />

        <div class="winner-card">

            <template v-if="comparison.left.games > comparison.right.games">

                🏆
                <strong>{{ comparison.left.name }}</strong>
                tiene una biblioteca más grande.

            </template>

            <template v-else-if="comparison.right.games > comparison.left.games">

                🏆
                <strong>{{ comparison.right.name }}</strong>
                tiene una biblioteca más grande.

            </template>

            <template v-else>

                🤝 Ambos tienen la misma cantidad de juegos.

            </template>

        </div>

    </section>

</template>

<style scoped>
.overview {

    display: flex;

    flex-direction: column;

    gap: 1.25rem;

}

.winner-card {

    background: #1b2838;

    padding: 1rem;

    border-radius: 12px;

    text-align: center;

    font-size: 1rem;

}
</style>