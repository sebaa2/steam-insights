<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const formatDate = (timestamp) => {
  if (!timestamp) return 'No disponible'
  return new Date(timestamp * 1000).toLocaleDateString('es-CL')
}

const goToLibrary = () => {
  if (props.profile?.steamId) {
    router.push(`/games/${props.profile.steamId}`)
  }
}
</script>

<template>
  <div class="profile-card">
    <img :src="profile.avatar" class="profile-avatar" />

    <div class="profile-info">
      <h2>{{ profile.name }}</h2>

      <p v-if="profile.realName">
        {{ profile.realName }}
      </p>

      <p>Steam ID: {{ profile.steamId }}</p>

      <p>País: {{ profile.country }}</p>

      <p>Miembro desde: {{ formatDate(profile.createdAt) }}</p>

      <button class="library-btn" @click="goToLibrary">
        Ver biblioteca →
      </button>
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
  flex: 1;
}

.profile-info h2 {
  margin: 0;
}

.profile-info p {
  margin: 0;
}

.library-btn {
  margin-top: 0.5rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #66c0f4, #1a9fff);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.library-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 159, 255, 0.4);
}

.library-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .library-btn {
    align-self: center;
  }
}
</style>