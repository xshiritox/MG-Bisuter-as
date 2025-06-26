<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppHero from './components/AppHero.vue'
import AppAbout from './components/AppAbout.vue'
import AppGallery from './components/AppGallery.vue'
import AppContact from './components/AppContact.vue'
import AppMap from './components/AppMap.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <AppHero />
    <AppAbout />
    <AppGallery />
    <AppContact />
    <AppMap />
    <AppFooter />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}
</style>