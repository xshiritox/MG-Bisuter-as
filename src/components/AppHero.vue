<script setup lang="ts">
import { Sparkles, ArrowRight } from 'lucide-vue-next'

const scrollToGallery = () => {
  const element = document.getElementById('galeria')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToContact = () => {
  const contact = document.getElementById('contacto')
  if (contact) {
    contact.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="inicio" class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-badge">
          <Sparkles class="sparkles-icon" />
          <span>Accesorios Únicos y Personalizados</span>
        </div>
        
        <h1 class="hero-title">
          Descubre la magia de 
          <span class="hero-title-accent">MG Bisuterías</span>
        </h1>
        
        <p class="hero-description">
          «Donde la simplicidad se vuelve arte y la elegancia, una historia»
        </p>
        
        <div class="hero-buttons">
          <button @click="scrollToGallery" class="btn-primary">
            Ver Catálogo
            <ArrowRight class="btn-icon" />
          </button>
          <button @click="scrollToContact" class="btn-secondary">
            Personalizar Pedido
          </button>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="hero-card">
          <div class="card-glow"></div>
          <div class="hero-logo">
            <img src="/logomg.jpg" alt="MG Bisuterías Logo" class="logo-image" />
          </div>
        </div>
        <div class="floating-elements">
          <div class="floating-element element-1"></div>
          <div class="floating-element element-2"></div>
          <div class="floating-element element-3"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e5e7eb 100%);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  animation: slideInLeft 1s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
  color: #8B5CF6;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.sparkles-icon {
  width: 1rem;
  height: 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.hero-title-accent {
  background: linear-gradient(135deg, #8B5CF6, #A855F7, #9333EA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #8B5CF6;
  border: 2px solid #8B5CF6;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #8B5CF6;
  color: white;
  transform: translateY(-2px);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  animation: slideInRight 1s ease-out;
}

.hero-card {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: all 0.4s ease;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1/1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-card:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.hero-card:hover .card-glow {
  opacity: 1;
}

.hero-logo {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.logo-icon {
  width: 6rem;
  height: 6rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;
}

.hero-card:hover {
  transform: perspective(1000px) rotateY(0) rotateX(0);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.hero-card:hover .logo-image {
  transform: scale(1.05);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  top: 20%;
  left: -40px;
  animation-delay: 0s;
  opacity: 0.1;
}

.element-2 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #A855F7, #9333EA);
  top: 60%;
  right: -30px;
  animation-delay: 2s;
  opacity: 0.15;
}

.element-3 {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #9333EA, #8B5CF6);
  top: 80%;
  left: 20%;
  animation-delay: 4s;
  opacity: 0.2;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .btn-primary, .btn-secondary {
    padding: 0.875rem 1.5rem;
  }

  .hero-card {
    max-width: 300px;
  }

  .hero-logo {
    height: 400px;
  }

  .logo-icon {
    width: 4rem;
    height: 4rem;
  }

  .logo-text {
    font-size: 3rem;
  }
}
</style>