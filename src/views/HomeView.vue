<script setup>
import SearchProfile from '@/components/profile/SearchProfile.vue'
</script>

<template>
    <main class="home">

        <h1>Steam Insights</h1>

        <p>
            Analiza cualquier perfil público de Steam
        </p>

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

h1 {
    font-size: 3rem;
}

p {
    color: var(--steam-text-secondary);
}
</style>