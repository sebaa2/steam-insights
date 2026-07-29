<!-- src/components/compare/CompareProfileCard.vue -->
<script setup>
defineProps({
    profile: {
        type: Object,
        required: true
    },
    side: {
        type: String,
        required: true,
        validator: (value) => ['left', 'right'].includes(value)
    }
})

const formatHours = (hours) => {
    if (!hours || hours === 0) return '0'
    if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k`
    if (hours >= 10) return `${Math.round(hours)}`
    return `${Math.round(hours * 10) / 10}`
}
</script>

<template>
    <div class="profile-card-compare" :class="side">
        <div class="profile-avatar-wrapper">
            <img :src="profile.avatar" :alt="profile.name" class="profile-avatar" />
            <div class="profile-badge">🎮</div>
        </div>
        <h2 class="profile-name">{{ profile.name }}</h2>
        <span class="profile-id">ID: {{ profile.steamId }}</span>
        <div class="profile-stats-mini">
            <div class="mini-stat">
                <span class="stat-value">{{ profile.games }}</span>
                <span class="stat-label">Juegos</span>
            </div>
            <div class="mini-stat">
                <span class="stat-value">{{ formatHours(profile.hours) }}</span>
                <span class="stat-label">Horas</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-card-compare {
    flex: 1;
    text-align: center;
    padding: 1.5rem;
    border-radius: 12px;
    background: var(--steam-dark);
    transition: transform 0.2s ease;
}

.profile-card-compare:hover {
    transform: translateY(-4px);
}

.profile-card-compare.left {
    border: 2px solid rgba(102, 192, 244, 0.3);
}

.profile-card-compare.right {
    border: 2px solid rgba(255, 107, 107, 0.3);
}

.profile-avatar-wrapper {
    position: relative;
    display: inline-block;
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid var(--steam-primary);
    object-fit: cover;
}

.profile-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--steam-primary);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 2px solid var(--steam-surface);
}

.profile-name {
    margin: 0.75rem 0 0.25rem 0;
    font-size: 1.2rem;
    color: var(--steam-text);
}

.profile-id {
    color: var(--steam-text-secondary);
    font-size: 0.8rem;
    display: block;
    margin-bottom: 1rem;
}

.profile-stats-mini {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}

.mini-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.mini-stat .stat-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: #66c0f4;
}

.mini-stat .stat-label {
    font-size: 0.75rem;
    color: var(--steam-text-secondary);
}

@media (max-width: 480px) {
    .profile-avatar {
        width: 80px;
        height: 80px;
    }
}
</style>