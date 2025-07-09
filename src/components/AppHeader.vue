<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X, Gem, Lock } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

// Admin state
const showAdminLogin = ref(false)
const isAdmin = ref(false)
const adminEmail = ref('')
const adminPassword = ref('')
const loginError = ref('')

// Check if user is already logged in
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  isAdmin.value = !!user
})

const router = useRouter()

const handleAdminLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail.value,
      password: adminPassword.value,
    })
    
    if (error) throw error
    
    // Set admin state
    isAdmin.value = true
    
    // Clear form and close modal
    adminEmail.value = ''
    adminPassword.value = ''
    loginError.value = ''
    showAdminLogin.value = false
    
    // Redirect to admin panel
    router.push('/admin')
    
  } catch (error) {
    loginError.value = 'Credenciales incorrectas'
    console.error('Login error:', error)
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  isAdmin.value = false
}

// Menu toggle state
const isMenuOpen = ref(false)

const toggleMenu = (event?: Event) => {
  if (event) event.stopPropagation()
  isMenuOpen.value = !isMenuOpen.value
  
  // Bloquear/desbloquear el scroll del body cuando el menú está abierto
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

const handleMobileLinkClick = (sectionId: string) => {
  toggleMenu();
  // Desplazarse a la sección después de que el menú se cierre
  if (!isMenuOpen.value) {
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 300);
  }
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
        <!-- Logo with Admin Login -->
        <div class="logo" @click.stop="showAdminLogin = true" style="cursor: pointer;">
          <Gem class="logo-icon" />
          <span class="logo-text">MG Bisuterías</span>
          <span class="admin-badge" v-if="!isAdmin">Admin</span>
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
      <div v-show="isMenuOpen" class="mobile-menu" @click.stop>
        <ul class="mobile-nav-menu">
          <li><a @click="handleMobileLinkClick('inicio')" class="mobile-nav-link">Inicio</a></li>
          <li><a @click="handleMobileLinkClick('nosotros')" class="mobile-nav-link">Nosotros</a></li>
          <li><a @click="handleMobileLinkClick('galeria')" class="mobile-nav-link">Galería</a></li>
          <li><a @click="handleMobileLinkClick('contacto')" class="mobile-nav-link">Contacto</a></li>
          <li><a @click="handleMobileLinkClick('ubicacion')" class="mobile-nav-link">Ubicación</a></li>
        </ul>
      </div>
    </nav>
  </header>

<!-- Admin Login Modal -->
<transition name="fade">
  <div v-if="showAdminLogin" class="admin-modal">
    <div class="admin-modal-content">
      <h3>Acceso Administrativo</h3>
      
      <form @submit.prevent="handleAdminLogin" class="admin-form">
        <div class="form-group">
          <label>Usuario:</label>
          <input 
            v-model="adminEmail" 
            type="email" 
            placeholder="Correo electrónico"
            required
          >
        </div>
        
        <div class="form-group">
          <label>Contraseña:</label>
          <input 
            v-model="adminPassword" 
            type="password" 
            placeholder="••••••••"
            required
          >
        </div>
        
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
        
        <div class="form-actions">
          <button 
            type="button" 
            @click="showAdminLogin = false"
            class="btn btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</transition>
</template>

<style scoped>
/* Admin Login Button */
.admin-login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-login-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.lock-icon {
  width: 1rem;
  height: 1rem;
}

/* Admin Panel Link */
.admin-panel-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.admin-panel-link:hover {
  background-color: #2563eb;
}

/* Admin Modal */
.admin-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; backdrop-filter: blur(0); }
  to { opacity: 1; backdrop-filter: blur(4px); }
}

.admin-modal-content {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  padding: 2.5rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(203, 213, 225, 0.3);
  position: relative;
  overflow: hidden;
}

.admin-modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.admin-modal h3 {
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;
}

.admin-modal h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

.admin-form .form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.admin-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #475569;
  transition: color 0.2s;
}

.admin-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: #1e293b;
  background-color: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.admin-form input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background-color: #f8fafc;
}

.admin-form input:hover {
  border-color: #cbd5e1;
}

/* Placeholder styles */
.admin-form input::placeholder {
  color: #94a3b8;
  font-weight: 400;
  opacity: 1;
}

/* For Internet Explorer 10-11 */
.admin-form input:-ms-input-placeholder {
  color: #94a3b8;
  font-weight: 400;
}

/* For Microsoft Edge */
.admin-form input::-ms-input-placeholder {
  color: #94a3b8;
  font-weight: 400;
}

/* Floating label effect */
.admin-form .form-group:focus-within label {
  color: #3b82f6;
}

.error-message {
  margin: 0.5rem 0 0;
  color: #ef4444;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  background-color: #fef2f2;
  border-radius: 0.375rem;
  border-left: 3px solid #ef4444;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.btn {
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 100px;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.btn-secondary {
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  color: #475569;
  font-weight: 500;
}

.btn-secondary:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: translateY(0);
}

/* Loading state */
.btn.loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
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
  font-weight: 600;
  font-size: 1.25rem;
  color: #1f2937;
  position: relative;
  padding-right: 1rem;
  transition: all 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.admin-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #3b82f6;
  color: white;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  line-height: 1;
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.2s;
}

.logo:hover .admin-badge {
  opacity: 1;
  transform: scale(1);
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
  position: fixed;
  top: 70px; /* Altura del header */
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1000;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Estado inicial y final de la animación */
.mobile-menu {
  transform: translateY(-100%);
  opacity: 0;
}

.mobile-menu.v-show {
  transform: translateY(0);
  opacity: 1;
}

.mobile-nav-menu {
  list-style: none;
  margin: 0;
  padding: 0 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  display: block;
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font-size: 1rem;
}

.mobile-nav-link:active {
  background-color: rgba(139, 92, 246, 0.1);
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
    z-index: 1001;
  }

  .nav-container {
    padding: 1rem;
    position: relative;
  }
}
</style>