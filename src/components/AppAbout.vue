<script setup lang="ts">
import { Heart, Users, Award, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <section id="nosotros" class="about">
    <div class="about-container">
      <div class="about-header">
        <h2 class="section-title">Sobre MG Bisuterías</h2>
      </div>

      <div class="about-content">
        <div class="about-text">
          <p class="about-description">
            Descubre nuestra colección artesanal de pulseras, collares, tobilleras, 
            colgantes y mucho más, todos hechos a mano con dedicación y cuidado para reflejar tu esencia.
          </p>
          
          <p class="about-description">
            Cada sueño, cada idea, la transformamos en una obra artesanal que refleja tu esencia. 
            Dedicación y cuidado en cada detalle para entregarte más que un accesorio, una historia para llevar contigo.
          </p>

          <div class="about-values">
            <div class="value-item">
              <Heart class="value-icon" />
              <div>
                <h3 class="value-title">Pasión</h3>
                <p class="value-text">Cada pieza es creada con amor y dedicación</p>
              </div>
            </div>

            <div class="value-item">
              <Users class="value-icon" />
              <div>
                <h3 class="value-title">Personalización</h3>
                <p class="value-text">Diseños únicos adaptados a tu estilo</p>
              </div>
            </div>

            <div class="value-item">
              <Award class="value-icon" />
              <div>
                <h3 class="value-title">Calidad</h3>
                <p class="value-text">Materiales de calidad y acabados impecables</p>
              </div>
            </div>

            <div class="value-item">
              <Sparkles class="value-icon" />
              <div>
                <h3 class="value-title">Innovación</h3>
                <p class="value-text">Siempre explorando nuevas tendencias</p>
              </div>
            </div>
          </div>
        </div>

        <div class="about-images">
          <div class="image-grid">
            <div class="image-card primary">
              <img src="/Producto/01.jpg" 
                   alt="Producto 1" class="about-image" />
            </div>
            <div class="image-card secondary">
              <img src="/Producto/02.jpg" 
                   alt="Producto 2" class="about-image" />
            </div>
            <div class="image-card tertiary">
              <img src="/Producto/03.jpg" 
                   alt="Producto 3" class="about-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 5rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
}

.about-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.about-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.value-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.15);
}

.value-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #8B5CF6;
  flex-shrink: 0;
}

.value-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.value-text {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 500px;
}

.image-card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.image-card:hover {
  transform: scale(1.05);
}

.primary {
  grid-row: 1 / 3;
}

.secondary {
  grid-row: 1 / 2;
}

.tertiary {
  grid-row: 2 / 3;
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-values {
    grid-template-columns: 1fr;
  }

  .image-grid {
    height: 400px;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>