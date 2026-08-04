<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})
</script>

<template>
    <button class="app-button" :disabled="disabled">
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
    white-space: nowrap;
}

.app-button:hover:not(:disabled) {
    background: var(--steam-primary-hover);
}

.app-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>