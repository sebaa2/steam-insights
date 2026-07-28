<script setup>
const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
})

const ranges = [
    {
        label: 'Sin jugar',
        value: props.stats.hoursRanges['0h'],
    },
    {
        label: '1 - 10 h',
        value: props.stats.hoursRanges['1-10h'],
    },
    {
        label: '10 - 50 h',
        value: props.stats.hoursRanges['10-50h'],
    },
    {
        label: '50 - 100 h',
        value: props.stats.hoursRanges['50-100h'],
    },
    {
        label: '100+ h',
        value: props.stats.hoursRanges['100h+'],
    },
]
</script>

<template>
    <section class="dashboard">

        <h2>Análisis de la biblioteca</h2>

        <div v-for="range in ranges" :key="range.label" class="range-row">

            <span class="label">
                {{ range.label }}
            </span>

            <div class="bar">
                <div class="fill" :style="{ width: `${range.value * 8}px` }" />
            </div>

            <span class="value">
                {{ range.value }}
            </span>

        </div>

    </section>
</template>

<style scoped>
.dashboard {

    display: flex;

    flex-direction: column;

    gap: 1rem;

    margin-top: 2rem;

}

.range-row {

    display: grid;

    grid-template-columns: 110px 1fr 40px;

    gap: 1rem;

    align-items: center;

}

.bar {

    background: #223447;

    height: 12px;

    border-radius: 999px;

    overflow: hidden;

}

.fill {

    height: 100%;

    background: #66c0f4;

    border-radius: 999px;

}

.label {

    color: var(--steam-text-secondary);

}

.value {

    text-align: right;

}
</style>