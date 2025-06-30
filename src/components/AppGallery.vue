<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShoppingBag, Eye } from 'lucide-vue-next'

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}


const selectedProduct = ref<Product | null>(null)
const showConfirmation = ref(false)
const currentProduct = ref<Product | null>(null)

const products: Product[] = [
  {
    id: 1,
    name: 'Pulsera con cruces',
    category: 'Pulseras',
    price: 250,
    image: '/Producto/Galeria/1.jpg',
    description: 'Hermosa pulsera con cruces'
  },
  {
    id: 2,
    name: 'Pulsera con flores tejidas',
    category: 'pulseras',
    price: 300,
    image: '/Producto/Galeria/2.jpg',
    description: 'Pulsera con flores tejidas'
  },
  {
    id: 3,
    name: 'Pulsera paracord',
    category: 'pulseras',
    price: 300,
    image: '/Producto/Galeria/3.jpg',
    description: 'Pulsera paracord'
  },
  {
    id: 4,
    name: 'Pulsera love',
    category: 'pulseras',
    price: 250,
    image: '/Producto/Galeria/4.jpg',
    description: 'Pulsera love'
  },
  {
    id: 5,
    name: 'Pulsera gymrat',
    category: 'pulseras',
    price: 300,
    image: '/Producto/Galeria/5.jpg',
    description: 'Pulsera gymrat'
  },
  {
    id: 6,
    name: 'Pulsera amor infinito',
    category: 'pulseras',
    price: 250,
    image: '/Producto/Galeria/6.jpg',
    description: 'Pulsera amor infinito'
  }
]

const filteredProducts = computed<Product[]>(() => [...products])


const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price)
}

const openProductModal = (product: Product) => {
  selectedProduct.value = product
}

const closeProductModal = () => {
  selectedProduct.value = null
}

const handleConsultation = (product: Product) => {
  currentProduct.value = product
  showConfirmation.value = true
}

const confirmConsultation = () => {
  if (!currentProduct.value) return
  
  const message = `Hola, estoy interesad@ en el producto: ${currentProduct.value.name} (${formatPrice(currentProduct.value.price)})`
  const whatsappUrl = `https://wa.me/5355466420?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  showConfirmation.value = false
}

const cancelConsultation = () => {
  showConfirmation.value = false
  currentProduct.value = null
}
</script>

<template>
  <section id="galeria" class="gallery">
    <div class="gallery-container">
      <div class="gallery-header">
        <h2 class="section-title">Catálogo</h2>
        <p class="section-subtitle">
          Descubre mi colección de accesorios únicos y personalizados
        </p>
      </div>

<!-- Products Grid -->
      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card"
        >
          <div class="product-image-container">
            <img :src="product.image" :alt="product.name" class="product-image" />
            <div class="product-overlay">
              <button @click="openProductModal(product)" class="overlay-btn">
                <Eye class="btn-icon" />
                Ver Detalles
              </button>
            </div>
          </div>
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
            <button class="add-to-cart-btn" @click="handleConsultation(product)">
              <ShoppingBag class="btn-icon" />
              Consultar
            </button>
          </div>
        </div>
      </div>
      

    </div>

    <!-- Product Modal -->
    <div v-if="selectedProduct" class="modal-overlay" @click="closeProductModal">
      <div class="modal-content" @click.stop>
        <div class="modal-image">
          <img :src="selectedProduct.image" :alt="selectedProduct.name" />
        </div>
        <div class="modal-info">
          <h3 class="modal-title">{{ selectedProduct.name }}</h3>
          <p class="modal-price">{{ formatPrice(selectedProduct.price) }}</p>
          <p class="modal-description">{{ selectedProduct.description }}</p>
          
          <div class="modal-features">
            <h4>Características:</h4>
            <ul>
              <li>Material premium</li>
              <li>Diseño personalizable</li>
              <li>Garantía de calidad</li>
            </ul>
          </div>
          
          <div class="modal-actions">
            <button class="btn-primary" @click="handleConsultation(selectedProduct)">Consultar Precio</button>
            <button @click="closeProductModal" class="btn-secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal de Confirmación -->
  <div v-if="showConfirmation" class="confirmation-overlay">
    <div class="confirmation-modal">
      <div class="confirmation-content">
        <h3>¡Consulta sobre producto!</h3>
        <p>¿Deseas consultar sobre este producto?</p>
        <p class="product-name">{{ currentProduct?.name }}</p>
        <p class="product-price">{{ currentProduct ? formatPrice(currentProduct.price) : '' }}</p>
        <div class="confirmation-buttons">
          <button @click="confirmConsultation" class="btn-confirm">
            Sí, ir a WhatsApp
          </button>
          <button @click="cancelConsultation" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  padding: 5rem 0;
  background: #ffffff;
}

.pagination-container {
  margin: 3rem auto 0;
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  position: relative;
  z-index: 10;
}

:deep(.page-item) {
  margin: 0 0.25rem;
}

:deep(.page-link) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

:deep(.page-link:hover) {
  border-color: #8B5CF6;
  color: #8B5CF6;
}

:deep(.page-item.active .page-link) {
  background-color: #8B5CF6;
  border-color: #8B5CF6;
  color: white;
}

:deep(.page-item.disabled .page-link) {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.gallery-header {
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 0 0.75rem;
  max-width: 100%;
  margin: 0 auto;
}

/* Estilos base para móviles (ya están configurados para 2 columnas) */

@media (min-width: 500px) {
  .products-grid {
    padding: 0 1.5rem;
  }
}

@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .product-image {
    padding: 0.75rem;
  }
  
  .product-name {
    font-size: 0.9rem;
  }
  
  .product-price {
    font-size: 1rem;
  }
  
  .add-to-cart-btn {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
  }
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 0 1.5rem;
  }
  
  .product-card {
    border-radius: 0.6rem;
  }
  
  .product-image {
    height: 160px;
  }
  
  .product-name {
    font-size: 0.95rem;
  }
  
  .product-price {
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 3rem 2rem;
    padding: 0 2rem;
  }
}

/* Estilos de paginación */
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 3rem 0;
}

:deep(.Pagination) {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

:deep(.Page) {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4b5563;
  font-weight: 500;
}

:deep(.Page):hover:not(.Active) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

:deep(.Page.Active) {
  background-color: #8B5CF6;
  border-color: #8B5CF6;
  color: white;
}

:deep(.Page-arrow) {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4b5563;
}

:deep(.Page-arrow):hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #8B5CF6;
}

:deep(.Page-arrow):disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.product-card {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 0.9em;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
}

.product-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem 0.5rem 0 0;
  padding-top: 100%; /* Relación de aspecto 1:1 */
  background: #f8f9fa;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0.3rem;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-btn {
  background: white;
  color: #1f2937;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}

.overlay-btn:hover {
  transform: scale(1.05);
}

.product-info {
  padding: 0.6rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.1rem 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;
}

.product-price {
  font-size: 1rem;
  font-weight: 700;
  color: #8B5CF6;
  margin: 0.2rem 0 0.5rem 0;
}

@media (min-width: 768px) {
  .product-info {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1.1rem;
    margin-bottom: 0.05rem;
  }
  
  .product-price {
    font-size: 1.35rem;
    margin: 0.05rem 0 0.4rem 0;
  }
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 0.4rem 0.5rem;
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  margin-top: auto;
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 800px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.modal-info {
  padding: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.modal-price {
  font-size: 2rem;
  font-weight: 800;
  color: #8B5CF6;
  margin-bottom: 1rem;
}

.modal-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.modal-features h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.modal-features ul {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.modal-features li {
  color: #6b7280;
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1rem;
}

.modal-features li::before {
  content: '✓';
  color: #8B5CF6;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
}

.btn-secondary {
  background: transparent;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Estilos para el modal de confirmación */
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.confirmation-modal {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.confirmation-content h3 {
  color: #7C3AED;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.confirmation-content p {
  color: #4B5563;
  margin-bottom: 0.5rem;
}

.product-name {
  font-weight: 600;
  font-size: 1.2rem;
  color: #1F2937 !important;
  margin: 1rem 0 !important;
}

.product-price {
  font-weight: 700;
  color: #8B5CF6 !important;
  font-size: 1.3rem;
  margin-bottom: 1.5rem !important;
}

.confirmation-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-confirm, .btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-confirm {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(124, 58, 237, 0.4);
}

.btn-cancel {
  background: #F3F4F6;
  color: #6B7280;
}

.btn-cancel:hover {
  background: #E5E7EB;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    grid-template-columns: 1fr;
    max-height: 90vh;
    overflow-y: auto;
  }

  .category-filter {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .filter-btn {
    white-space: nowrap;
  }
}
</style>