<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)

// Check if user is authenticated
onMounted(async () => {
  const isAuthenticated = await authStore.checkAuth()
  if (!isAuthenticated) {
    router.push('/')
  }
  loading.value = false
})

const handleLogout = async () => {
  try {
    loading.value = true
    const { success, error } = await authStore.logout()
    if (success) {
      // Forzar recarga completa para limpiar el estado de la aplicación
      window.location.href = '/'
    } else if (error) {
      console.error('Error al cerrar sesión:', error)
      // Aún así redirigir al home si hay un error
      window.location.href = '/'
    }
  } catch (err) {
    console.error('Error inesperado al cerrar sesión:', err)
    window.location.href = '/'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
  
  <div v-else class="admin-layout">
    <header class="admin-header">
      <div class="container">
        <h1>Panel de Administración</h1>
        <button @click="handleLogout" class="logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </header>
    
    <main class="admin-main">
      <div class="container">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f3f4f6;
}

.admin-header {
  background-color: #111827;
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.admin-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.logout-btn {
  background-color: #374151;
  color: white;
  border: 1px solid #4b5563;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.logout-btn:hover {
  background-color: #4b5563;
}

.logout-btn svg {
  flex-shrink: 0;
}

/* Estilos para móviles */
@media (max-width: 640px) {
  .admin-header {
    padding: 1rem 0;
  }
  
  .admin-header h1 {
    font-size: 1.25rem;
    max-width: 55%;
  }
  
  .logout-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .logout-btn span {
    display: none; /* Ocultar texto en móviles muy pequeños */
  }
  
  .logout-btn svg {
    margin-right: 0;
  }
}

.admin-main {
  flex: 1;
  margin-top: 5rem; /* Espacio para el header fijo */
  padding: 1rem 0;
  
  @media (max-width: 640px) {
    margin-top: 4rem;
    padding: 0.5rem 0;
  }
  padding: 1.5rem 0;
}

.admin-main .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
