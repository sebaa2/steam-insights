<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" class="app-input" type="text" placeholder="Steam ID o URL del perfil" />
</template>

<style scoped>
.app-input {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--steam-border);
  background: var(--steam-surface);
  color: var(--steam-text);
  font-size: 1rem;
}

.app-input:focus {
  outline: none;
  border-color: var(--steam-primary);
}
</style>