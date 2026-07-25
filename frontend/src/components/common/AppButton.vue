<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <button class="app-button">
        {{ label }}
    </button>
</template>

<style scoped>
.app-button {
    background: var(--steam-primary);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.85rem 1.6rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

.app-button:hover {
    background: var(--steam-primary-hover);
}
</style>