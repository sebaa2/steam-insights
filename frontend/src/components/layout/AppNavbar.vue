<script setup>
import { RouterLink, useRoute } from 'vue-router'

import { useProfileStore } from '@/stores/profileStore'
import ProfileDropdown from '@/components/profile/ProfileDropdown.vue'

const profileStore = useProfileStore()
const route = useRoute()
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

        <ProfileDropdown v-if="profileStore.profile && route.path !== '/'" />

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
    transition: .2s;
}

.menu a:hover {
    color: #66c0f4;
}

.menu a.router-link-active {
    color: #66c0f4;
}

@media (max-width: 768px) {

    .navbar {
        gap: 1rem;
        padding: 1rem;
    }

    .menu {
        gap: 1rem;
    }

}
</style>