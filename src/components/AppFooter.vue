<script setup lang="ts">
import { Gem, Instagram, Facebook, Mail, Phone, MapPin, MessageCircle } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-brand">
          <div class="footer-logo">
            <Gem class="logo-icon" />
            <span class="logo-text">MG Bisuterías</span>
          </div>
          <p class="brand-description">
            Creamos piezas únicas de bisutería personalizada que reflejan tu estilo personal. 
            Cada accesorio es cuidadosamente diseñado para destacar tu belleza natural.
          </p>
          <div class="social-links">
            <a href="https://www.instagram.com/mg__bisuterias?utm_source=ig_web_button_share_sheet&igsh=NnZwYng1eDdzZWc5" class="social-link" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="https://www.facebook.com/maday.gallegogarcia" class="social-link" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="https://wa.me/5355466420" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle />
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="footer-nav">
          <h4 class="footer-title">Navegación</h4>
          <ul class="nav-links">
            <li><a @click="scrollToSection('inicio')" class="footer-link">Inicio</a></li>
            <li><a @click="scrollToSection('nosotros')" class="footer-link">Nosotros</a></li>
            <li><a @click="scrollToSection('galeria')" class="footer-link">Galería</a></li>
            <li><a @click="scrollToSection('contacto')" class="footer-link">Contacto</a></li>
            <li><a @click="scrollToSection('ubicacion')" class="footer-link">Ubicación</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-contact">
          <h4 class="footer-title">Contacto</h4>
          <div class="contact-info">
            <div class="contact-item">
              <Phone class="contact-icon" />
              <a href="tel:+5355466420" class="contact-link">+53 55466420</a>
            </div>
            <div class="contact-item">
              <Mail class="contact-icon" />
              <a href="mailto:madaygallego789@gmail.com" class="contact-link">madaygallego789@gmail.com</a>
            </div>
            <div class="contact-item">
              <MapPin class="contact-icon" />
              <span>Calle 52 B #10 entre calle 57 y mártires de la herradura.<br>Puerto Padre, Cuba</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} MG Bisuterías. Todos los derechos reservados.
          </p>
        </div>
        <button @click="scrollToTop" class="back-to-top">
          ↑ Volver arriba
        </button>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="footer-decoration">
      <div class="decoration-element element-1"></div>
      <div class="decoration-element element-2"></div>
      <div class="decoration-element element-3"></div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 0;
  position: relative;
  z-index: 2;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 350px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #8B5CF6;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.75rem;
  color: #8B5CF6;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #8B5CF6;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f9fafb;
  margin-bottom: 1.5rem;
}

.nav-links,
.services-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links li,
.services-links li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
}

.footer-link:hover {
  color: #8B5CF6;
  transform: translateX(5px);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #d1d5db;
}

.contact-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #8B5CF6;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.contact-link {
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-link:hover {
  color: #8B5CF6;
  text-decoration: underline;
}

.newsletter-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  background: rgba(139, 92, 246, 0.1);
  padding: 2.5rem;
  border-radius: 1rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.newsletter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f9fafb;
  margin-bottom: 0.5rem;
}

.newsletter-description {
  color: #d1d5db;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-input:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
}

.newsletter-btn {
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.newsletter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.footer-bottom {
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  padding: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.copyright {
  color: #9ca3af;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.back-to-top {
  background: rgba(139, 92, 246, 0.2);
  color: #8B5CF6;
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-left: 2rem;
}

.back-to-top:hover {
  background: #8B5CF6;
  color: white;
  transform: translateY(-2px);
}

.footer-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
  animation: float 8s ease-in-out infinite;
}

.element-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.element-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 5%;
  animation-delay: 3s;
}

.element-3 {
  width: 80px;
  height: 80px;
  bottom: 10%;
  right: 20%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  33% {
    transform: translateY(-20px) scale(1.1);
  }
  66% {
    transform: translateY(10px) scale(0.9);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .newsletter-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .back-to-top {
    margin-left: 0;
    margin-top: 1rem;
  }

  .footer-container {
    padding: 3rem 1rem 0;
  }
}

@media (max-width: 480px) {
  .footer-brand {
    max-width: 100%;
  }

  .newsletter-section {
    padding: 2rem 1.5rem;
  }

  .social-links {
    justify-content: center;
  }
}
</style>