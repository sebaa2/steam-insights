<!-- components/achievements/AchievementCard.vue -->
<script setup>
defineProps({
    achievement: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="achievement-item" :class="{
        'achieved': achievement.achieved === true,
        'locked': achievement.achieved === false,
        'unknown': achievement.achieved === null
    }">
        <div class="achievement-icon">
            <img v-if="achievement.achieved && achievement.icon" :src="achievement.icon" :alt="achievement.displayName"
                class="achievement-img" @error="(e) => e.target.style.display = 'none'">
            <img v-else-if="!achievement.achieved && achievement.iconGray" :src="achievement.iconGray"
                :alt="achievement.displayName" class="achievement-img grayscale"
                @error="(e) => e.target.style.display = 'none'">
            <span v-else class="placeholder-icon">🏆</span>
        </div>
        <div class="achievement-info">
            <h3>{{ achievement.displayName || achievement.name || 'Logro sin nombre' }}</h3>
            <p>{{ achievement.description || 'Sin descripción' }}</p>
            <div class="achievement-meta">
                <span v-if="achievement.hidden" class="meta-tag hidden">🔒 Oculto</span>
                <span v-if="achievement.achieved === true" class="meta-tag achieved">✅ Desbloqueado</span>
                <span v-else-if="achievement.achieved === false" class="meta-tag locked">🔒 Bloqueado</span>
                <span v-else class="meta-tag unknown">❓ Desconocido</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.achievement-item {
    background: #1a2a3a;
    padding: 1.2rem;
    border-radius: 8px;
    display: flex;
    gap: 1rem;
    border: 1px solid #2a3f52;
    transition: all 0.2s ease;
}

.achievement-item.achieved {
    border-color: #4caf50;
}

.achievement-item.locked {
    opacity: 0.6;
}

.achievement-item.unknown {
    opacity: 0.4;
}

.achievement-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.achievement-icon {
    min-width: 64px;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    background: #0a1a2a;
}

.achievement-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.achievement-img.grayscale {
    filter: grayscale(1);
    opacity: 0.5;
}

.placeholder-icon {
    font-size: 2.5rem;
}

.achievement-info {
    flex: 1;
    min-width: 0;
}

.achievement-info h3 {
    margin: 0 0 0.3rem 0;
    color: #e0e0e0;
    font-size: 1rem;
}

.achievement-info p {
    margin: 0 0 0.5rem 0;
    color: #8b9aab;
    font-size: 0.9rem;
    line-height: 1.4;
}

.achievement-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.meta-tag {
    font-size: 0.75rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    font-weight: 600;
}

.meta-tag.hidden {
    background: #3a3a3a;
    color: #8b9aab;
}

.meta-tag.achieved {
    background: #1b5e20;
    color: #81c784;
}

.meta-tag.locked {
    background: #4a2a3a;
    color: #ef5350;
}

.meta-tag.unknown {
    background: #3a3a3a;
    color: #8b9aab;
}
</style>