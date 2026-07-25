<script setup>
import { ref } from 'vue'

import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import {detectSteamInput} from '@/utils/steamValidator.js'
const search = ref('')

const searchProfile = () => {
    const result = detectSteamInput(search.value)
    console.log(result)
}
</script>

<template>
  <div class="search-card">
    <AppInput v-model="search" />

    <AppButton
      label="Buscar perfil"
      @click="searchProfile"
    />
  </div>
</template>

<style scoped>
.search-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}
</style>