import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import GamesView from '@/views/GamesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/games', // 👈 Ruta para ver todos los juegos
      name: 'games',
      component: GamesView,
    },
    {
      path: '/games/:steamId', // 👈 Ruta con parámetro opcional
      name: 'games-with-id',
      component: GamesView,
      props: true, // Permite pasar el steamId como prop
    },
    {
      path: '/achievements/:appId',
      name: 'achievements',
      component: () => import('@/views/AchievementsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/CompareView.vue'),
    },
  ],
})

export default router
