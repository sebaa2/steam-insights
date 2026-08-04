<script setup>
const model = defineModel()

defineProps({
  placeholder: {
    type: String,
    default: 'Steam ID o URL del perfil'
  }
})
</script>

<template>
  <input v-model="model" class="app-input" type="text" :placeholder="placeholder" />
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
  transition: border-color 0.2s ease;
}

.app-input:focus {
  outline: none;
  border-color: var(--steam-primary);
}

.app-input::placeholder {
  color: var(--steam-text-secondary);
  opacity: 0.7;
}
</style>