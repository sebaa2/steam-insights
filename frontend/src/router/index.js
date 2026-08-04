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
      path: '/results', // 👈 Ruta simple sin query params
      name: 'results',
      component: () => import('@/views/ResultsView.vue'),
    },
    {
      path: '/games',
      name: 'games',
      component: GamesView,
    },
    {
      path: '/games/:steamId',
      name: 'games-with-id',
      component: GamesView,
      props: true,
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
