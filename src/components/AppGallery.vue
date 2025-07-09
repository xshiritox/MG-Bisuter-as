<script setup lang="ts">
// Component name for devtools
defineOptions({
  name: 'AppGallery',
  inheritAttrs: false
})
import { ref, onMounted, computed, watch } from 'vue'
import { ShoppingBag, Eye } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

// Definir las categorías disponibles
const CATEGORIES = [
  'Collares',
  'Pulseras',
  'Cadenas para espejuelos',
  'Adornos para estetoscopios',
  'Colgantes',
  'Llaveros'
] as const

type Category = typeof CATEGORIES[number]

interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  image_url: string;
  description: string;
  featured?: boolean;
}

// Referencias reactivas
const selectedProduct = ref<Product | null>(null)
const showConfirmation = ref(false)
const loading = ref(true)
const error = ref('')
const touchStartX = ref(0)
const touchEndX = ref(0)
const currentCategoryIndex = ref(0)

// Almacenar todos los productos
const allProducts = ref<Product[]>([])

// Categorías únicas
const categoryKeys = ref<string[]>([])
const selectedCategory = ref<string | null>(null)
const showCategoryDropdown = ref(false)

// Inicializar categories con un objeto vacío
const categories = ref<CategoryProducts>({})

// Manejar la confirmación de consulta
const confirmConsultation = () => {
  if (selectedProduct.value) {
    const message = `Hola, me interesa el producto: ${encodeURIComponent(selectedProduct.value.name)}`
    window.open(`https://wa.me/5355466420?text=${message}`, '_blank')
    selectedProduct.value = null
  }
}

// Interfaz para compatibilidad
interface CategoryProducts {
  [key: string]: {
    products: Product[]
    currentSlide: number
  }
}

// Inicialmente se define como ref vacío, se actualiza en updateFilteredProducts

// Agrupar productos por categoría
const groupProductsByCategory = (productsList: Product[]) => {
  const grouped: CategoryProducts = {}
  
  // Filtrar productos nulos o sin categoría
  const validProducts = productsList.filter(p => p && p.category != null && p.category.trim() !== '')
  
  // Filtrar por la categoría seleccionada
  const filteredProducts = selectedCategory.value 
    ? validProducts.filter(p => p.category === selectedCategory.value)
    : validProducts
  
  filteredProducts.forEach(product => {
    if (product && product.category) {
      if (!grouped[product.category]) {
        grouped[product.category] = {
          products: [],
          currentSlide: 0
        }
      }
      grouped[product.category].products.push(product)
    }
  })
  
  return grouped
}

// Navegación del carrusel por categoría
const nextSlide = (category: string | number) => {
  const categoryKey = String(category)
  if (!categories.value[categoryKey]) return
  
  // Crear una copia profunda del estado actual
  const updatedCategories = JSON.parse(JSON.stringify(categories.value))
  const currentData = updatedCategories[categoryKey]
  
  // Calcular el nuevo índice
  const total = currentData.products.length
  currentData.currentSlide = (currentData.currentSlide + 1) % total
  
  // Forzar la actualización del estado
  categories.value = { ...updatedCategories }
}

const prevSlide = (category: string | number) => {
  const categoryKey = String(category)
  if (!categories.value[categoryKey]) return
  
  // Crear una copia profunda del estado actual
  const updatedCategories = JSON.parse(JSON.stringify(categories.value))
  const currentData = updatedCategories[categoryKey]
  
  // Calcular el nuevo índice
  const total = currentData.products.length
  currentData.currentSlide = (currentData.currentSlide - 1 + total) % total
  
  // Forzar la actualización del estado
  categories.value = { ...updatedCategories }
}

// Obtener la posición de cada slide en el carrusel
const getSlidePosition = (index: number, currentIndex: number, total: number) => {
  if (total <= 0) return null
  
  // Calcular la posición relativa al slide actual
  let relativePos = index - currentIndex
  
  // Ajustar para manejar el desbordamiento circular
  if (relativePos < -Math.floor(total / 2)) {
    relativePos += total
  } else if (relativePos > Math.floor(total / 2)) {
    relativePos -= total
  }
  
  // Solo mostrar los 5 slides más cercanos al actual
  if (relativePos < -2 || relativePos > 2) {
    return null
  }
  
  // Asegurarse de que el índice esté en el rango 0-4
  const position = relativePos + 2
  return Math.min(Math.max(0, position), 4)
}

// Actualizar productos filtrados cuando cambia la categoría seleccionada
const updateFilteredProducts = () => {
  if (!allProducts.value) return
  
  // Obtener las categorías agrupadas
  const newCategories = groupProductsByCategory(allProducts.value)
  
  // Preservar el estado de currentSlide para las categorías existentes
  Object.keys(newCategories).forEach(key => {
    if (categories.value[key]) {
      newCategories[key].currentSlide = categories.value[key].currentSlide || 0
    } else {
      newCategories[key].currentSlide = 0
    }
  })
  
  // Actualizar las categorías
  categories.value = { ...newCategories }
}

// Cargar productos al montar el componente
onMounted(() => {
  fetchProducts()
})

// Actualizar productos cuando cambia la categoría seleccionada
watch(selectedCategory, () => {
  updateFilteredProducts()
})

// Actualizar las claves de categoría cuando se cargan los productos
watch(() => categories.value, (newCategories: CategoryProducts) => {
  const keys = Object.keys(newCategories)
  categoryKeys.value = keys
  
  // Si hay una categoría seleccionada pero ya no existe, limpiar la selección
  if (selectedCategory.value && !keys.includes(selectedCategory.value)) {
    selectedCategory.value = null
  }
}, { immediate: true, deep: true })

// Obtener productos
const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (fetchError) throw fetchError
    
    // Almacenar todos los productos
    allProducts.value = data || []
    // Actualizar las categorías con los nuevos productos
    updateFilteredProducts()
    
  } catch (err) {
    error.value = 'Error al cargar los productos. Por favor, intente más tarde.'
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}



// Manejar el cierre del menú desplegable
const handleDropdownBlur = () => {
  setTimeout(() => {
    showCategoryDropdown.value = false
  }, 200)
}

// Función para seleccionar una categoría
const selectCategory = (category: string | null) => {
  selectedCategory.value = category
  showCategoryDropdown.value = false
}

// Formatear precio
const formatPrice = (price: number): string => {
  // Si el precio es un número entero, mostrarlo sin decimales
  if (Number.isInteger(price)) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Si tiene decimales, mostrarlos
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}


</script>

<template>
  <section class="gallery-section">
    <div v-if="loading" class="loading-container">
      Cargando productos destacados...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="Object.keys(categories).length === 0" class="no-products">
      No hay productos disponibles en este momento.
    </div>

    <div v-else class="categories-container">
      <!-- Menú desplegable de categorías -->
      <div class="category-dropdown">
        <button 
          class="dropdown-toggle"
          @click="showCategoryDropdown = !showCategoryDropdown"
          @blur="handleDropdownBlur"
        >
          {{ selectedCategory || 'Selecciona una categoría' }}
          <span class="dropdown-arrow" :class="{ 'rotate-180': showCategoryDropdown }">▼</span>
        </button>
        
        <transition name="fade">
          <div v-if="showCategoryDropdown" class="dropdown-menu">
            <button 
              v-for="category in CATEGORIES" 
              :key="category"
              class="dropdown-item"
              :class="{ active: selectedCategory === category }"
              @click="selectCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </transition>
      </div>

      <!-- Carrusel de la categoría seleccionada -->
      <div 
        v-if="selectedCategory && categories[selectedCategory]"
        :key="selectedCategory" 
        class="category-section"
      >
        <div class="carousel-container">
          <button 
            class="carousel-nav-button prev" 
            @click="prevSlide(selectedCategory)" 
            aria-label="Anterior"
            :disabled="categories[selectedCategory].products.length <= 1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <div class="carousel">
            <div class="carousel-track">
              <div 
                v-for="(product, index) in categories[selectedCategory].products" 
                :key="product.id"
                class="carousel-slide"
                :data-pos="getSlidePosition(index, categories[selectedCategory].currentSlide, categories[selectedCategory].products.length)"
                :class="{ 'active': index === categories[selectedCategory].currentSlide }"
                @click="selectedProduct = product"
                v-show="getSlidePosition(index, categories[selectedCategory].currentSlide, categories[selectedCategory].products.length) !== null"
              >
                <div class="product-card">
                  <div class="image-container">
                    <img 
                      :src="product.image_url" 
                      :alt="product.name" 
                      class="product-image"
                    />
                  </div>
                  <div class="product-info">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-price">{{ formatPrice(product.price) }}</p>
                    <button 
                      class="view-details"
                      @click.stop="selectedProduct = product"
                    >
                      <Eye class="icon" /> Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            class="carousel-nav-button next" 
            @click="nextSlide(selectedCategory)" 
            aria-label="Siguiente"
            :disabled="categories[selectedCategory].products.length <= 1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del producto -->
    <div v-if="selectedProduct" class="modal-overlay" @click.self="selectedProduct = null">
      <div class="product-modal">
        <button class="close-modal" @click="selectedProduct = null">&times;</button>
        <div class="modal-content">
          <img :src="selectedProduct.image_url" :alt="selectedProduct.name" class="modal-image">
          <div class="modal-details">
            <h3>{{ selectedProduct.name }}</h3>
            <p class="product-category">{{ selectedProduct.category }}</p>
            <p class="product-price">{{ formatPrice(selectedProduct.price) }}</p>
            <p class="product-description">{{ selectedProduct.description }}</p>
            <button class="cta-button" @click="confirmConsultation">
              <ShoppingBag class="icon" /> Consultar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showConfirmation" class="confirmation-modal">
      <div class="confirmation-content">
        <h3>¿Deseas más información sobre este producto?</h3>
        <div class="confirmation-buttons">
          <button class="confirm-button" @click="confirmConsultation">Sí, contactar</button>
          <button class="cancel-button" @click="showConfirmation = false">Cancelar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Estilos del contenedor de categorías */
.categories-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* Menú desplegable de categorías */
.category-dropdown {
  position: relative;
  max-width: 300px;
  margin: 0 auto 2rem;
  z-index: 10;
}

.dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.dropdown-toggle:hover {
  border-color: #cbd5e0;
  background: #f8fafc;
}

.dropdown-arrow {
  margin-left: 10px;
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-toggle:focus .dropdown-arrow,
.dropdown-toggle:hover .dropdown-arrow {
  transform: translateY(2px);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: left;
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #7c3aed;
}

.dropdown-item.active {
  background: #f5f3ff;
  color: #7c3aed;
  font-weight: 600;
}

/* Animación del menú desplegable */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Estilos del carrusel */
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
  perspective: 1000px;
}

.carousel {
  position: relative;
  width: 100%;
  height: 400px;
  margin: 0 auto;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.carousel-slide {
  position: absolute;
  width: 300px;
  height: 100%;
  left: 50%;
  top: 0;
  transform-style: preserve-3d;
  transition: all 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  backface-visibility: hidden;
}

.carousel-slide[data-pos="0"] {
  transform: translateX(-50%) translateX(-300px) scale(0.7) translateZ(-100px);
  z-index: 1;
  opacity: 0.9;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide[data-pos="1"] {
  transform: translateX(-50%) translateX(-150px) scale(0.85) translateZ(-50px);
  z-index: 2;
  opacity: 0.95;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide[data-pos="2"] {
  transform: translateX(-50%) scale(1) translateZ(0);
  z-index: 5;
  opacity: 1;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide[data-pos="3"] {
  transform: translateX(-50%) translateX(150px) scale(0.85) translateZ(-50px);
  z-index: 2;
  opacity: 0.95;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide[data-pos="4"] {
  transform: translateX(-50%) translateX(300px) scale(0.7) translateZ(-100px);
  z-index: 1;
  opacity: 0.9;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide:hover {
  z-index: 10 !important;
  opacity: 1 !important;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.product-card {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #333;
}

.product-price {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.view-details {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.view-details:hover {
  background: #1a252f;
  transform: translateY(-2px);
}

.icon {
  width: 16px;
  height: 16px;
}

/* Estilos para los botones de navegación del carrusel */
.carousel-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #2c3e50;
}

.carousel-nav-button:hover:not(:disabled) {
  background: #2c3e50;
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.carousel-nav-button.prev {
  left: 10px;
}

.carousel-nav-button.next {
  right: 10px;
}

.carousel-nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: translateY(-50%);
}

@media (min-width: 768px) {
  .carousel-nav-button {
    width: 50px;
    height: 50px;
  }
  
  .carousel-nav-button.prev {
    left: 20px;
  }
  
  .carousel-nav-button.next {
    right: 20px;
  }
}

.carousel-button.next {
  right: 20px;
}

.carousel-button.prev {
  left: 20px;
}

/* Hacer que los botones sean más grandes en pantallas grandes */
@media (min-width: 1024px) {
  .carousel-button {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
  
  .carousel-button.prev {
    left: 30px;
  }
  
  .carousel-button.next {
    right: 30px;
  }
}

.carousel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: translateY(-50%);
}

/* Estilos de las tarjetas de producto */
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding;
  background-clip: padding-box;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  z-index: 2;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.product-price {
  font-size: 1.35rem;
  font-weight: 700;
  color: #7c3aed;
  margin: 0.5rem 0 1.25rem;
  background: linear-gradient(90deg, #7c3aed, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.view-details {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: auto;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.view-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.view-details:active {
  transform: translateY(0);
}

.view-details .icon {
  margin-right: 0.5rem;
  width: 1.1rem;
  height: 1.1rem;
  transition: transform 0.3s ease;
}

.view-details:hover .icon {
  transform: translateX(3px);
}

/* Indicadores de navegación */
.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e2e8f0;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  transform: scale(1.2);
}

/* Estilos para el modal de detalles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; backdrop-filter: blur(0); }
  to { opacity: 1; backdrop-filter: blur(5px); }
}

.product-modal {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  color: #4a5568;
  z-index: 10;
  transition: all 0.2s ease;
}

.close-modal:hover {
  background: rgba(0, 0, 0, 0.15);
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
  color: #2d3748;
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.modal-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
}

.modal-details {
  padding: 2.5rem;
}

.modal-details h3 {
  font-size: 2rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.modal-details .product-category {
  display: inline-block;
  background: #f0f4ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.modal-details .product-title {
  font-size: 1.1rem;
  margin: 10px 0 5px;
  color: #2d3436;
  font-weight: 600;
  background: linear-gradient(45deg, #2d3436, #636e72);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  padding: 0 10px;
}

.modal-details .product-price {
  font-size: 1.75rem;
  margin: 1rem 0 1.5rem;
  background: linear-gradient(90deg, #7c3aed, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.modal-details .product-description {
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

.btn-ver-mas {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #7c3aed, #8b5cf6);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
}

.btn-ver-mas:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
}

.cta-button .icon {
  margin-right: 0.75rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .icon {
  transform: translateX(3px);
}

/* Estilos para móviles */
@media (max-width: 1024px) {
  .carousel-slide[data-pos="0"],
  .carousel-slide[data-pos="4"] {
    opacity: 0.5;
    transform: translateX(-50%) translateZ(-300px) scale(0.7);
  }
  
  .carousel-slide[data-pos="1"],
  .carousel-slide[data-pos="3"] {
    opacity: 0.8;
    transform: translateX(-50%) translateZ(-150px) scale(0.85);
  }
  
  .carousel-slide[data-pos="2"] {
    transform: translateX(-50%) translateZ(0) scale(1);
  }
}

@media (max-width: 768px) {
  .carousel-container {
    padding: 0 50px;
  }
  
  .carousel-slide {
    width: 240px;
  }
  
  .carousel-slide[data-pos="0"],
  .carousel-slide[data-pos="4"] {
    display: none;
  }
  
  .carousel-slide[data-pos="1"] { left: 33.333%; transform: translateX(-50%) translateZ(-100px) scale(0.9); }
  .carousel-slide[data-pos="2"] { left: 50%; transform: translateX(-50%) translateZ(0) scale(1); }
  .carousel-slide[data-pos="3"] { left: 66.666%; transform: translateX(-50%) translateZ(-100px) scale(0.9); }
  
  .modal-content {
    flex-direction: column;
  }
  
  .modal-image {
    height: 250px;
  }
  
  .modal-details {
    padding: 1.75rem;
  }
  
  .modal-details h3 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    padding: 0 40px;
  }
  
  .carousel-slide {
    width: 85%;
  }
  
  .carousel-slide[data-pos="1"],
  .carousel-slide[data-pos="3"] {
    opacity: 0.6;
    transform: translateX(-50%) translateZ(-150px) scale(0.8);
  }
  
  .carousel-slide[data-pos="2"] {
    transform: translateX(-50%) translateZ(0) scale(1);
  }
  
  .carousel-button {
    width: 50px;
    height: 50px;
  }
  
  .modal-details {
    padding: 1.5rem;
  }
  
  .modal-details h3 {
    font-size: 1.5rem;
  }
  
  .modal-details .product-price {
    font-size: 1.5rem;
  }
}

/* Estilos para la sección de carga y errores */
.loading-container,
.error-message,
.no-products {
  text-align: center;
  padding: 3rem 2rem;
  font-size: 1.2rem;
  color: #4a5568;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.error-message {
  color: #e53e3e;
  background: rgba(229, 62, 62, 0.05);
  border-left: 4px solid #e53e3e;
}

/* Mejoras de accesibilidad */
button:focus {
  outline: 3px solid rgba(124, 58, 237, 0.5);
  outline-offset: 2px;
}

/* Efecto de carga */
@keyframes shimmer {
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}

.loading-shimmer {
  background: #f6f7f8;
  background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
  animation: shimmer 1s infinite linear;
  background-size: 1000px 104px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

/* Transiciones suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Efecto de hover en las tarjetas */
.product-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 16px;
}

.product-card:hover::after {
  opacity: 1;
}

/* Mejora en la legibilidad del texto */
.product-info {
  position: relative;
  z-index: 1;
}

/* Efecto de profundidad en el hover */
.product-card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Mejora en los botones de navegación */
.carousel-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.carousel-button:hover::before {
  opacity: 1;
}

.carousel-button:not(:disabled):hover {
  color: white;
  transform: translateY(-50%) scale(1.08);
}
</style>