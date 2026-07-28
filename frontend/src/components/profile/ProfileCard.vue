<script setup>
defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'No disponible'

  return new Date(timestamp * 1000).toLocaleDateString('es-CL')
}
</script>

<template>
  <div class="profile-card">
    <img :src="profile.avatar" class="profile-avatar">

    <div class="profile-info">
      <h2>{{ profile.name }}</h2>

      <p v-if="profile.realName">
        {{ profile.realName }}
      </p>

      <p>Steam ID: {{ profile.steamId }}</p>

      <p>País: {{ profile.country }}</p>

      <p>Miembro desde: {{ formatDate(profile.createdAt) }}</p>
    </div>
  </div>
</template>

<style scoped>
.profile-card {

  display: flex;

  gap: 2rem;

  align-items: center;

  background: var(--steam-surface);

  padding: 2rem;

  border-radius: 12px;

}

.profile-avatar {

  width: 120px;

  border-radius: 50%;

}

.profile-info {

  display: flex;

  flex-direction: column;

  gap: .5rem;

}

.profile-info h2 {

  margin: 0;

}

.profile-info p {

  margin: 0;

}
</style>