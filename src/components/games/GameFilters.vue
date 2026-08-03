<script setup>
import GameFilterChips from './GameFilterChips.vue'

const search = defineModel('search')
const sort = defineModel('sort')
const status = defineModel('status')
</script>

<template>
    <div class="filters">

        <!-- Buscador -->
        <input v-model="search" placeholder="🔍 Buscar juego..." class="search-input">

        <!-- Orden -->
        <select v-model="sort" class="sort-select">
            <option value="hours-desc">
                Más jugados
            </option>

            <option value="hours-asc">
                Menos jugados
            </option>

            <option value="name-asc">
                Nombre A-Z
            </option>

            <option value="name-desc">
                Nombre Z-A
            </option>
        </select>

    </div>

    <!-- Chips rápidos -->
    <GameFilterChips v-model="status" />
</template>

<style scoped>
.filters {

    display: flex;

    gap: 1rem;

    margin-bottom: 1rem;

    flex-wrap: wrap;

}

.search-input {

    flex: 1;

    min-width: 260px;

    padding: .85rem 1rem;

    border-radius: 10px;

    border: 1px solid #2a3f52;

    background: #1a2a3a;

    color: white;

    font-size: .95rem;

}

.search-input:focus {

    outline: none;

    border-color: #66c0f4;

}

.sort-select {

    min-width: 200px;

    padding: .85rem 1rem;

    border-radius: 10px;

    border: 1px solid #2a3f52;

    background: #1a2a3a;

    color: white;

}

@media(max-width:768px) {

    .filters {

        flex-direction: column;

    }

    .sort-select {

        width: 100%;

    }

}
</style>