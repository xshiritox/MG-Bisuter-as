<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './components/AppHeader.vue'
import AppHero from './components/AppHero.vue'
import AppAbout from './components/AppAbout.vue'
import AppGallery from './components/AppGallery.vue'
import AppContact from './components/AppContact.vue'
import AppMap from './components/AppMap.vue'
import AppFooter from './components/AppFooter.vue'

// Initialize auth store
const authStore = useAuthStore()

onMounted(() => {
  authStore.init()
})
</script>

<template>
  <div class="app">
    <AppHeader />
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
      
      <!-- Main content (shown when not in admin panel) -->
      <template v-if="!$route.path.startsWith('/admin')">
        <AppHero />
        <AppAbout />
        <AppGallery />
        <AppContact />
        <AppMap />
      </template>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

main {
  flex: 1;
  padding: 2rem 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>