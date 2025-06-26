<script setup lang="ts">
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-vue-next'

// El formulario se maneja directamente con HTML (action y method)

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
        <h2 class="section-title">Contáctanos</h2>
        <p class="section-subtitle">
          Estamos aquí para ayudarte a crear la pieza perfecta para ti
        </p>
      </div>

      <div class="contact-content">
        <!-- Contact Info -->
        <div class="contact-info">
          <div class="info-card">
            <div class="info-header">
              <h3>Información de Contacto</h3>
              <p>Conecta con nosotros para tu pedido personalizado</p>
            </div>

            <div class="contact-methods">
              <div class="contact-method">
                <div class="method-icon">
                  <Phone />
                </div>
                <div class="method-info">
                  <h4>Teléfono</h4>
                  <p>+53 55466420</p>
                  <span class="method-note">Lun - Sáb: 9:00 AM - 10:00 PM</span>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">
                  <Mail />
                </div>
                <div class="method-info">
                  <h4>Email</h4>
                  <p>madaygallego789@gmail.com</p>
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

            <button @click="openWhatsApp" class="whatsapp-btn">
              <MessageCircle class="btn-icon" />
              Escribir por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-header {
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

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.info-card, .form-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.info-header {
  margin-bottom: 2rem;
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
  margin-bottom: 2rem;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.contact-method:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.method-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.method-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.method-info p {
  color: #4b5563;
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

.method-note {
  font-size: 0.875rem;
  color: #8B5CF6;
  font-weight: 500;
}

.whatsapp-btn {
  width: 100%;
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
}

.whatsapp-btn:hover {
  background: #22C55E;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
}

.form-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.form-card p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.info-item {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.info-item:hover {
  transform: translateY(-4px);
}

.info-item h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.info-item p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .additional-info {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .additional-info {
    grid-template-columns: 1fr;
  }

  .contact-container {
    padding: 0 1rem;
  }

  .info-card, .form-card {
    padding: 1.5rem;
  }
}
</style>