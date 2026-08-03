<script setup>
defineProps({
    profile: Object
})
</script>

<template>

    <div class="header">

        <img :src="profile.avatar" class="avatar">

        <div>

            <h3>{{ profile.name }}</h3>

            <p>{{ profile.games }} juegos</p>

            <small>{{ profile.hours }} horas</small>

        </div>

    </div>

</template>

<style scoped>
.header {

    display: flex;

    gap: 1rem;

    padding: 1rem;

    border-bottom: 1px solid #2a3f52;

}

.avatar {

    width: 64px;

    height: 64px;

    border-radius: 50%;

}

h3 {

    margin: 0;

}

p {

    margin: .3rem 0;

    color: #8b9aab;

}

small {

    color: #66c0f4;

}
</style>