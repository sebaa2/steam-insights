<!-- src/components/common/ErrorState.vue -->
<template>
    <div class="error-state">
        <p class="error-icon">⚠️</p>
        <p class="error-message">{{ message }}</p>
        <button class="retry-btn" @click="$emit('retry')">Reintentar</button>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        required: true
    }
})

defineEmits(['retry'])
</script>

<style scoped>
.error-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #ff6b6b;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.error-message {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.retry-btn {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: #ff6b6b;
    color: #1b2838;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;
}

.retry-btn:hover {
    background: #ff8787;
    transform: scale(1.05);
}
</style>