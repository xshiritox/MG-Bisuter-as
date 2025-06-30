<script setup lang="ts">
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-vue-next'

const openWhatsApp = () => {
  const phone = '+5355466420'
  const message = 'Hola, me interesa conocer más sobre sus productos de bisutería personalizada.'
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
</script>

<template>
  <section id="contacto" class="contact">
    <div class="contact-container">
      <div class="contact-header">
        <h2 class="section-title">Contáctame</h2>
      </div>

      <div class="contact-content">
        <!-- Contact Info -->
        <div class="contact-info">
          <div class="info-card">
            <div class="info-header">
              <h3>Información de Contacto</h3>
              <p>Contáctame para tu pedido personalizado</p>
            </div>

            <div class="contact-methods">
              <div class="contact-method">
                <div class="method-icon">
                  <Phone />
                </div>
                <div class="method-info">
                  <h4>Teléfono</h4>
                  <p><a href="tel:+5355466420" class="contact-link">+53 55466420</a></p>
                  <span class="method-note">Lun - Vier: 9:00 AM - 10:00 PM</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">
                  <Mail />
                </div>
                <div class="method-info">
                  <h4>Email</h4>
                  <p><a href="mailto:madaygallego789@gmail.com" class="contact-link">madaygallego789@gmail.com</a></p>
                  <span class="method-note">Respuesta en 24 horas</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">
                  <MapPin />
                </div>
                <div class="method-info">
                  <h4>Dirección</h4>
                  <p>Calle 52 B #10 entre calle 57 y mártires de la herradura.<br>Puerto Padre</p>
                  <span class="method-note">Visitas con cita previa</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">
                  <Clock />
                </div>
                <div class="method-info">
                  <h4>Horarios</h4>
                  <p>Lun - Vie: 9:00 AM - 10:00 PM</p>
                  <span class="method-note">Sab & Dom: Cerrado</span>
                </div>
              </div>
            </div>

            <!-- WhatsApp Button -->
            <div class="whatsapp-section">
              <button @click="openWhatsApp" class="whatsapp-btn">
                <MessageCircle class="btn-icon" />
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 2rem 0;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.contact-content {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
}

.info-card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.info-header {
  margin-bottom: 1rem;
  text-align: center;
}

.info-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.info-header p {
  color: #6b7280;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 0 auto;
  max-width: 900px;
  width: 100%;
}

.contact-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-method:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.method-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #8B5CF6;
  color: white;
  flex-shrink: 0;
  margin-bottom: 0.75rem;
}

.method-info h4 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.25rem;
}

.method-info p {
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.method-note {
  font-size: 0.8rem;
  color: #8B5CF6;
  font-weight: 500;
  margin-top: 0.25rem;
}

.contact-link {
  color: #4b5563;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #8B5CF6;
  text-decoration: underline;
}

.whatsapp-section {
  margin: 1.25rem auto 0;
  display: flex;
  justify-content: center;
  max-width: 280px;
  width: 100%;
}

.whatsapp-btn {
  background: #25D366;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  max-width: 300px;
  width: 100%;
}

.whatsapp-btn:hover {
  background: #22C55E;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .contact-methods {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .contact-method {
    flex-direction: row;
    text-align: left;
    align-items: center;
  }
  
  .method-icon {
    margin-bottom: 0;
    margin-right: 1rem;
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .contact-container {
    padding: 0 1rem;
  }

  .info-card {
    padding: 1.5rem;
  }
}
</style>