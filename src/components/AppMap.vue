<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (!mapContainer.value) return
  
  // Initialize map
  map = L.map(mapContainer.value).setView([21.188700, -76.598400], 13)

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map as L.Map)

  // Custom marker icon
  const customIcon = L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #8B5CF6, #A855F7);
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })

  // Add marker
  L.marker([21.188700, -76.598400], { icon: customIcon })
    .addTo(map)
    .bindPopup(`
      <div style="text-align: center; padding: 10px;">
        <h3 style="color: #8B5CF6; margin: 0 0 5px 0;">MG Bisuterías</h3>
        <p style="margin: 0; color: #666;">Calle 52 B #10<br>Entre calle 57 y Mártires de la Herradura<br>Puerto Padre, Cuba</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #8B5CF6;">📍 Visitas con cita previa</p>
      </div>
    `)
    .openPopup()

  // Add custom styles for better mobile experience
  const handleResize = () => {
    map?.invalidateSize()
  }
  
  window.addEventListener('resize', handleResize)
  
  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    map?.remove()
    map = null
  })
})
</script>

<template>
  <section id="ubicacion" class="map-section">
    <div class="map-container-wrapper">
      <div class="map-header">
        <h2 class="section-title">Ubicación</h2>
        <p class="section-subtitle">
          Encuéntrame en Puerto Padre para tu consulta personalizada
        </p>
      </div>

      <div class="map-content">
        <div class="map-info">
          <div class="info-card">
            <h3>Dirección Completa</h3>
            <p class="address">
              <strong>Calle 52 B #10 entre calle 57 y mártires de la herradura.</strong><br>
              Puerto Padre<br>
              Código Postal: 77300
            </p>

            <div class="visit-info">
              <h4>Información de Visitas</h4>
              <p>
                <strong>¡Importante!</strong> Las visitas son únicamente con cita previa. 
                Esto nos permite brindarte atención personalizada y dedicar el tiempo necesario 
                para discutir tu proyecto en detalle.
              </p>
              <button class="schedule-btn">
                📞 Agendar Cita
              </button>
            </div>
          </div>
        </div>

        <div class="map-wrapper">
          <div ref="mapContainer" class="map"></div>
          <div class="map-overlay">
            <div class="map-controls">
              <button @click="() => map?.zoomIn()" class="map-control-btn">+</button>
              <button @click="() => map?.zoomOut()" class="map-control-btn">−</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-section {
  padding: 5rem 0;
  background: #ffffff;
}

.map-container-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.map-header {
  text-align: center;
  margin-bottom: 3rem;
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

.map-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.info-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.info-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.address {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border-left: 4px solid #8B5CF6;
}

.transport-info,
.parking-info,
.visit-info {
  margin-bottom: 2rem;
}

.transport-info h4,
.parking-info h4,
.visit-info h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.transport-info ul,
.parking-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transport-info li,
.parking-info li {
  color: #6b7280;
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.transport-info li::before,
.parking-info li::before {
  content: '→';
  color: #8B5CF6;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.visit-info p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.schedule-btn {
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.schedule-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.map-wrapper {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  height: 500px;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: auto;
}

.map-control-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: white;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  color: #8B5CF6;
  transition: all 0.2s ease;
}

.map-control-btn:hover {
  background: #8B5CF6;
  color: white;
  transform: scale(1.1);
}

.location-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.feature-item {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.05);
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-item h4 {
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Leaflet popup custom styles */
:global(.leaflet-popup-content-wrapper) {
  border-radius: 0.75rem !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
}

:global(.leaflet-popup-tip) {
  background: white !important;
}

@media (max-width: 768px) {
  .map-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .location-features {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .map-wrapper {
    height: 400px;
  }

  .info-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .location-features {
    grid-template-columns: 1fr;
  }

  .feature-item {
    padding: 1.5rem 1rem;
  }

  .map-container-wrapper {
    padding: 0 1rem;
  }
}
</style>