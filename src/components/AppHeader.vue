<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, Gem } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMenuOpen.value = false
}
</script>

<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-container">
        <!-- Logo -->
        <div class="logo">
          <Gem class="logo-icon" />
          <span class="logo-text">MG Bisuterías</span>
        </div>

        <!-- Desktop Menu -->
        <ul class="nav-menu desktop-menu">
          <li><a @click="scrollToSection('inicio')" class="nav-link">Inicio</a></li>
          <li><a @click="scrollToSection('nosotros')" class="nav-link">Nosotros</a></li>
          <li><a @click="scrollToSection('galeria')" class="nav-link">Galería</a></li>
          <li><a @click="scrollToSection('contacto')" class="nav-link">Contacto</a></li>
          <li><a @click="scrollToSection('ubicacion')" class="nav-link">Ubicación</a></li>
        </ul>

        <!-- Mobile Menu Button -->
        <button @click="toggleMenu" class="mobile-menu-btn">
          <Menu v-if="!isMenuOpen" />
          <X v-if="isMenuOpen" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div :class="['mobile-menu', { 'mobile-menu-open': isMenuOpen }]">
        <ul class="mobile-nav-menu">
          <li><a @click="scrollToSection('inicio')" class="mobile-nav-link">Inicio</a></li>
          <li><a @click="scrollToSection('nosotros')" class="mobile-nav-link">Nosotros</a></li>
          <li><a @click="scrollToSection('galeria')" class="mobile-nav-link">Galería</a></li>
          <li><a @click="scrollToSection('contacto')" class="mobile-nav-link">Contacto</a></li>
          <li><a @click="scrollToSection('ubicacion')" class="mobile-nav-link">Ubicación</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: #8B5CF6;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desktop-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-link:hover {
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.1);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #1f2937;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.mobile-menu-open {
  transform: translateY(0);
  opacity: 1;
}

.mobile-nav-menu {
  list-style: none;
  margin: 0;
  padding: 1rem 2rem;
}

.mobile-nav-link {
  display: block;
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  cursor: pointer;
}

.mobile-nav-link:hover {
  color: #8B5CF6;
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: block;
  }

  .nav-container {
    padding: 1rem;
  }
}
</style>