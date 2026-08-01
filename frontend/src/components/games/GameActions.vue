<script setup>
const props = defineProps({
    game: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['achievements'])

const openSteam = () => {
    window.open(
        `https://store.steampowered.com/app/${props.game.id}`,
        '_blank'
    )
}

const openAchievements = () => {
    emit('achievements', props.game)
}
</script>

<template>
    <div class="actions">
        <button class="action steam" @click.stop="openSteam">
            🚀 Steam
        </button>

        <button class="action achievements" @click.stop="openAchievements">
            🏆 Logros
        </button>
    </div>
</template>

<style scoped>
.actions {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .7rem;
    background: rgba(10, 20, 35, .85);
    opacity: 0;
    transition: .3s ease;
    backdrop-filter: blur(4px);
}

.image-container:hover .actions {
    opacity: 1;
}

.action {
    width: 150px;
    padding: .7rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    letter-spacing: 0.5px;
}

.action:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.action:active {
    transform: scale(0.95);
}

.steam {
    background: #66c0f4;
    color: #1a2a3a;
}

.achievements {
    background: #ffd700;
    color: #1a2a3a;
}
</style>