<!-- src/components/common/EmptyState.vue -->
<template>
    <div class="empty-state">
        <p class="empty-icon">🎮</p>
        <p class="empty-message">No se encontraron juegos</p>
    </div>
</template>

<style scoped>
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #8b9aab;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.empty-message {
    font-size: 1.2rem;
}
</style>