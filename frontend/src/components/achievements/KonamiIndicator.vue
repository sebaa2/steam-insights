<!-- components/achievements/KonamiIndicator.vue -->
<script setup>
defineProps({
    show: Boolean
})
</script>

<template>
    <div v-if="show" class="konami-indicator">
        <div class="konami-content">
            <span class="konami-icon">🎮</span>
            <span class="konami-text">¡Código Konami activado!</span>
            <span class="konami-sub">Panel de debug disponible</span>
        </div>
    </div>
</template>

<style scoped>
.konami-indicator {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: #ffd700;
    padding: 1rem 2rem;
    border-radius: 12px;
    border: 2px solid #ffd700;
    z-index: 1000;
    animation: slideDown 0.5s ease, fadeOut 0.5s ease 3s forwards;
    text-align: center;
}

.konami-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
}

.konami-icon {
    font-size: 2rem;
}

.konami-text {
    font-weight: bold;
    font-size: 1.1rem;
}

.konami-sub {
    font-size: 0.8rem;
    color: #8b9aab;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

@keyframes fadeOut {

    0%,
    70% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>