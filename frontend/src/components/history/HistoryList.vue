<script setup>
const emit = defineEmits(['select'])

defineProps({
    history: {
        type: Array,
        required: true
    }
})

const formatDate = (timestamp) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000)

    if (diff < 60) return 'Hace unos segundos'
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`

    return new Date(timestamp).toLocaleDateString('es-CL')
}
</script>

<template>

    <section v-if="history.length" class="history-card">

        <h2>Búsquedas recientes</h2>

        <div v-for="profile in history" :key="profile.steamId" class="history-item"
            @click="emit('select', profile.steamId)">

            <img :src="profile.avatar" :alt="profile.name">

            <div class="history-info">

                <strong>{{ profile.name }}</strong>

                <span>{{ formatDate(profile.searchedAt) }}</span>

            </div>

        </div>

    </section>

</template>

<style scoped>
.history-card {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--steam-surface);
    border-radius: 12px;
}

.history-card h2 {
    margin-bottom: 1rem;
}

.history-item {

    display: flex;
    align-items: center;
    gap: 1rem;

    padding: .8rem;

    border-radius: 8px;

    cursor: pointer;

    transition: .2s;
}

.history-item:hover {

    background: #24384a;

}

.history-item img {

    width: 52px;
    height: 52px;

    border-radius: 50%;
}

.history-info {

    display: flex;
    flex-direction: column;

}

.history-info span {

    color: var(--steam-text-secondary);
    font-size: .85rem;

}
</style>