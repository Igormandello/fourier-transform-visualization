import { createWebHistory, createRouter } from 'vue-router'
import Visualization from '@/views/Visualization.vue'
import Series from '@/views/Series.vue'

const routes = [
  {
    path: '/',
    name: 'Visualization',
    component: Visualization
  },
  {
    path: '/series',
    name: 'Series',
    component: Series
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
