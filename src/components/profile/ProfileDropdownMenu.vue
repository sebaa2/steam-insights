<script setup>
import ProfileDropdownItem from './ProfileDropdownItem.vue'

const emit = defineEmits([
    'dashboard',
    'library',
    'achievements',
    'compare',
    'changeProfile',
    'logout'
])
</script>

<template>

    <div class="menu">

        <ProfileDropdownItem icon="🏠" label="Dashboard" @click="emit('dashboard')" />

        <ProfileDropdownItem icon="📚" label="Biblioteca" @click="emit('library')" />

        <ProfileDropdownItem icon="🏆" label="Logros" @click="emit('achievements')" />

        <ProfileDropdownItem icon="⚔" label="Comparador" @click="emit('compare')" />

        <hr>

        <ProfileDropdownItem icon="🔄" label="Cambiar perfil" @click="emit('changeProfile')" />

        <ProfileDropdownItem icon="🚪" label="Cerrar perfil" danger @click="emit('logout')" />

    </div>

</template>

<style scoped>
.menu {

    display: flex;

    flex-direction: column;

}

hr {

    border: none;

    border-top: 1px solid #2a3f52;

    margin: .25rem 0;

}
</style>