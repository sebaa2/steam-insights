<template>
  <Transition name="fade">
    <div v-if="show" class="overlay">
      <div class="loader-card">
        <div class="spinner"></div>

        <slot>
          <h2>Buscando perfil...</h2>
          <p>Obteniendo información desde Steam</p>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 20, 30, 0.85);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;

  backdrop-filter: blur(6px);
}

.loader-card {
  background: var(--steam-surface);
  padding: 2rem 3rem;
  border-radius: 14px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  min-width: 320px;
}

.loader-card h2 {
  margin: 0;
}

.loader-card p {
  color: var(--steam-text-secondary);
}

.spinner {
  width: 70px;
  height: 70px;

  border-radius: 50%;

  border: 6px solid rgba(255, 255, 255, .15);
  border-top: 6px solid #66c0f4;

  animation: spin .9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>