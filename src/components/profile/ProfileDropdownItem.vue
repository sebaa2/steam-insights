<script setup>
defineProps({
    icon: String,
    label: String,
    danger: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click'])
</script>

<template>
    <button class="dropdown-item" :class="{ danger }" @click="emit('click')">
        <span class="icon">{{ icon }}</span>
        <span>{{ label }}</span>
    </button>
</template>

<style scoped>
.dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: .75rem;

    padding: .75rem 1rem;

    background: none;
    border: none;

    color: white;

    cursor: pointer;

    transition: .2s;
}

.dropdown-item:hover {
    background: #223548;
}

.danger {
    color: #ff6b6b;
}

.icon {
    width: 22px;
    text-align: center;
}
</style>