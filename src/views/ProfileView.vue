<script setup>
defineProps({
  steamId: String,
})
</script>

<template>
  <main>
    <h1>Perfil de Steam</h1>
    <p>Steam ID: {{ steamId }}</p>
  </main>
</template>