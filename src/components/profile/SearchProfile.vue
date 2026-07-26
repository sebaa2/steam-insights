<script setup>
import { ref } from 'vue'

import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import { detectSteamInput } from '@/utils/steamValidator.js'

import { searchProfile } from '@/services/steamService'

const search = ref('')
const profile = ref(null)
const loading = ref(false)

const handleSearch = async () => {
  loading.value = true

  try {
    profile.value = await searchProfile(search.value)
    console.log(profile.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'No disponible'

  return new Date(timestamp * 1000).toLocaleDateString('es-CL')
}
</script>

<template>
  <div class="search-card">
    <AppInput v-model="search" />

    <AppButton label="Buscar perfil" @click="handleSearch" />

    <div v-if="profile" class="profile-card">

      <img :src="profile.avatar" class="profile-avatar">

      <div class="profile-info">

        <h2>{{ profile.name }}</h2>

        <p v-if="profile.realName">
          {{ profile.realName }}
        </p>

        <p>
          Steam ID: {{ profile.steamId }}
        </p>

        <p>
          País: {{ profile.country }}
        </p>

        <p>
          Miembro desde: {{ formatDate(profile.createdAt) }}
        </p>

      </div>

    </div>
  </div>
</template>

<style scoped>
.search-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}

.profile-card {
  margin-top: 2rem;
  padding: 2rem;

  display: flex;
  align-items: center;
  gap: 2rem;

  background: var(--steam-surface);
  border-radius: 12px;
}

.profile-avatar {
  width: 120px;
  height: 120px;

  border-radius: 50%;
  object-fit: cover;

  border: 3px solid var(--steam-primary);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.profile-info h2 {
  margin: 0;
  font-size: 2rem;
}

.profile-info p {
  margin: 0;
  color: var(--steam-text-secondary);
}
</style>