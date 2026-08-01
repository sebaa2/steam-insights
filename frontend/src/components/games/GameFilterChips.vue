<script setup>

const model = defineModel()

const chips = [

    {
        label: 'Todos',
        value: 'all'
    },

    {
        label: 'Jugados',
        value: 'played'
    },

    {
        label: 'Sin jugar',
        value: 'unplayed'
    },

    {
        label: '100h+',
        value: '100plus'
    }

]

</script>

<template>
    <div class="chips">

        <button v-for="chip in chips" :key="chip.value" class="chip" :class="{ active: model === chip.value }"
            @click="model = chip.value">
            {{ chip.label }}
        </button>

    </div>
</template>

<style scoped>
.chips {

    display: flex;

    flex-wrap: wrap;

    gap: .6rem;

}

.chip {

    padding: .55rem 1rem;

    border-radius: 999px;

    border: 1px solid #2a3f52;

    background: #1a2a3a;

    color: #dcdcdc;

    cursor: pointer;

    transition: .25s;

}

.chip:hover {

    border-color: #66c0f4;

}

.active {

    background: #66c0f4;

    color: #111;

    font-weight: 600;

}
</style>