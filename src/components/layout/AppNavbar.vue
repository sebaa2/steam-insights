<script setup>
import { RouterLink } from 'vue-router'
import { useProfileStore } from '@/stores/profileStore'

const profileStore = useProfileStore()
</script>

<template>
    <nav class="navbar">

        <div class="logo">
            Steam Insights
        </div>

        <div class="menu">
            <RouterLink to="/">
                Inicio
            </RouterLink>

            <RouterLink to="/compare">
                Comparar
            </RouterLink>
        </div>

        <div v-if="profileStore.profile" class="active-profile">

            <img :src="profileStore.profile.avatar" :alt="profileStore.profile.name">

            <div>

                <span class="label">
                    Perfil activo
                </span>

                <strong>
                    {{ profileStore.profile.name }}
                </strong>

                <RouterLink :to="`/games/${profileStore.profile.steamId}`">
                    Ver biblioteca →
                </RouterLink>

            </div>

        </div>

    </nav>
</template>

<style scoped>
.navbar {

    display: flex;

    justify-content: space-between;

    align-items: center;

    padding: 1rem 2rem;

    background: #171a21;

    margin-bottom: 2rem;

    gap: 2rem;

    flex-wrap: wrap;

}

.logo {

    color: #66c0f4;

    font-size: 1.4rem;

    font-weight: 700;

}

.menu {

    display: flex;

    gap: 2rem;

}

.menu a {

    color: white;

    text-decoration: none;

}

.menu a.router-link-active {

    color: #66c0f4;

}

.active-profile {

    display: flex;

    align-items: center;

    gap: 1rem;

}

.active-profile img {

    width: 52px;

    height: 52px;

    border-radius: 50%;

}

.label {

    display: block;

    color: #8f98a0;

    font-size: .8rem;

}

.active-profile a {

    display: block;

    color: #66c0f4;

    text-decoration: none;

    margin-top: .2rem;

}
</style>