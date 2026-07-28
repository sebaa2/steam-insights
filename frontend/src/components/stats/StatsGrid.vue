<script setup>

import { computed } from 'vue'

const props = defineProps({
    library: {
        type: Object,
        required: true,
    },
    stats: {
        type: Object,
        required: true,
    }
})

const formattedTotalHours = computed(() => {
    return Number(props.stats?.totalHours || 0).toLocaleString('es-CL', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
})

const formattedAverageHours = computed(() => {
    return Number(props.stats?.averageHours || 0).toLocaleString('es-CL', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
})

</script>

<template>
    <div class="stats-grid">
        <!-- Tarjeta 1: Total de juegos -->
        <div class="stat-card">
            <span class="label">Total de juegos</span>
            <span class="value">{{ library?.totalGames || 0 }}</span>
        </div>

        <!-- Tarjeta 2: Horas jugadas -->
        <div class="stat-card">
            <span class="label">Horas jugadas</span>
            <span class="value">{{ formattedTotalHours }}</span>
        </div>

        <!-- Tarjeta 3: Promedio de horas -->
        <div class="stat-card">
            <span class="label">Promedio</span>
            <span class="value">{{ formattedAverageHours }}</span>
        </div>

        <!-- Tarjeta 4: Juego más jugado -->
        <div class="stat-card">
            <span class="label">Juego más jugado</span>
            <span class="value">
                {{ stats?.favoriteGame?.name || '-' }}
            </span>
        </div>

        <!-- ⭐ BONUS: Tarjeta 5: Juego menos jugado -->
        <div class="stat-card">
            <span class="label">Juego menos jugado</span>
            <span class="value">
                {{ stats?.leastPlayed?.name || '-' }}
            </span>
            <small v-if="stats?.leastPlayed">
                {{ stats.leastPlayed.hoursPlayed }} h
            </small>
        </div>

        <!-- ⭐ BONUS: Tarjeta 6: Juegos sin jugar -->
        <div class="stat-card">
            <span class="label">Sin jugar</span>
            <span class="value">
                {{ stats?.neverPlayed || 0 }}
            </span>
        </div>

        <!-- ⭐ BONUS: Tarjeta 7: Completitud -->
        <div class="stat-card">
            <span class="label">Tasa de completitud</span>

            <span class="value">
                {{ stats?.completion || 0 }}%
            </span>

            <div class="progress">
                <div class="progress-fill" :style="{ width: (stats?.completion || 0) + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

/* Si quieres que las tarjetas del bonus ocupen todo el ancho */
/* .stat-card:last-child {
    grid-column: 1 / -1;
} */

.stat-card {
    background: var(--steam-surface);
    padding: 1.5rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.label {
    color: var(--steam-text-secondary);
    font-size: .9rem;
}

.value {
    font-size: 1.5rem;
    font-weight: 600;
}

.sub-value {
    color: var(--steam-text-secondary);
    font-size: .85rem;
}

.progress {
    width: 100%;
    height: 8px;

    margin-top: .5rem;

    background: #23384b;

    border-radius: 999px;

    overflow: hidden;
}

.progress-fill {
    height: 100%;

    background: linear-gradient(90deg,
            #66c0f4,
            #1a9fff);

    transition: width .4s ease;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 520px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>