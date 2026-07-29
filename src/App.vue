<script setup>
import { onMounted } from 'vue'

import AppNavbar from '@/components/layout/AppNavbar.vue'

import { useProfileStore } from '@/stores/profileStore'

const profileStore = useProfileStore()

onMounted(() => {

  profileStore.loadProfile()

})
</script>

<template>

  <AppNavbar />

  <RouterView />

</template>