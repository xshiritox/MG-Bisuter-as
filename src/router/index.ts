import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'
import AdminPanel from '@/views/AdminPanel.vue'

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true }
  }
  // Add other routes as needed
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (to.meta.requiresAuth && !user) {
    next('/')
  } else {
    next()
  }
})

export default router
