<script setup>
import SearchProfile from '@/components/profile/SearchProfile.vue'
</script>

<template>
    <main class="home">
        <div class="hero">
            <h1>Steam Insights</h1>
            <p>Analiza cualquier perfil público de Steam</p>
        </div>
        <SearchProfile />
    </main>
</template>

<style scoped>
.home {
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
}

.hero {
    text-align: center;
    animation: fadeIn 0.5s ease-out;
}

h1 {
    font-size: 3rem;
    background: linear-gradient(135deg, #66c0f4, #1a9fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

p {
    color: var(--steam-text-secondary);
    font-size: 1.1rem;
    margin-top: 0.5rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    h1 {
        font-size: 2.2rem;
    }

    p {
        font-size: 1rem;
    }
}
</style>