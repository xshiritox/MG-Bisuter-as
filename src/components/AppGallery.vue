<!-- Script de configuración del componente -->
<script setup lang="ts">
// Importaciones de Vue y dependencias
import { ref, computed } from 'vue'
// Importación de iconos de Lucide
import { ShoppingBag, Eye } from 'lucide-vue-next'

// Interfaz que define la estructura de un producto
interface Product {
  id: number;           // Identificador único del producto
  name: string;        // Nombre del producto
  category: string;    // Categoría del producto
  price: number;       // Precio del producto
  image: string;       // Ruta de la imagen del producto
  description: string; // Descripción detallada
}


// Referencias reactivas
const selectedProduct = ref<Product | null>(null)  // Producto seleccionado para ver detalles
const showConfirmation = ref(false)               // Controla la visibilidad del modal de confirmación
const currentProduct = ref<Product | null>(null)  // Producto actual para consulta

// Lista de productos disponibles en la galería
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

// Lista filtrada de productos (actualmente muestra todos los productos)
const filteredProducts = computed<Product[]>(() => [...products])


/**
 * Formatea un precio como moneda colombiana (COP)
 * @param price - Precio a formatear
 * @returns Precio formateado como cadena de texto
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price)
}

/**
 * Abre el modal con los detalles del producto
 * @param product - Producto a mostrar en el modal
 */
const openProductModal = (product: Product) => {
  selectedProduct.value = product
}

/**
 * Cierra el modal de detalles del producto
 */
const closeProductModal = () => {
  selectedProduct.value = null
}

/**
 * Maneja la solicitud de consulta de un producto
 * @param product - Producto sobre el que se desea consultar
 */
const handleConsultation = (product: Product) => {
  currentProduct.value = product
  showConfirmation.value = true
}

/**
 * Confirma la consulta y abre WhatsApp con el mensaje predefinido
 */
const confirmConsultation = () => {
  if (!currentProduct.value) return
  
  // Crear mensaje para WhatsApp
  const message = `Hola, estoy interesad@ en el producto: ${currentProduct.value.name} (${formatPrice(currentProduct.value.price)})`
  const whatsappUrl = `https://wa.me/5355466420?text=${encodeURIComponent(message)}`
  
  // Abrir WhatsApp en una nueva pestaña
  window.open(whatsappUrl, '_blank')
  showConfirmation.value = false
}

/**
 * Cancela la consulta y cierra el modal
 */
const cancelConsultation = () => {
  showConfirmation.value = false
  currentProduct.value = null
}
</script>

<!-- Plantilla del componente -->
<template>
  <!-- Sección principal de la galería -->
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
            <div class="product-details">
              <h3 class="product-name">{{ product.name }}</h3>
              <span class="product-price">{{ formatPrice(product.price) }}</span>
            </div>
            <button class="add-to-cart-btn" @click.stop="handleConsultation(product)">
              <ShoppingBag :size="14" />
              Consultar
            </button>
          </div>
        </div>
      </div>
      

    </div>

    <!-- Modal de detalles del producto -->
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

  <!-- Modal de confirmación para consulta por WhatsApp -->
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

<!-- Estilos con alcance al componente -->
<style scoped>
/* Estilos de la sección de galería */
.gallery {
  padding: 5rem 0;        /* Espaciado vertical */
  background: #ffffff;     /* Fondo blanco */
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

/* Contenedor de la cuadrícula de productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 2 columnas en móviles */
  gap: 0.8rem;                          /* Espaciado entre elementos */
  padding: 0 0.75rem;                   /* Relleno horizontal */
  max-width: 100%;                      /* Ancho máximo */
  margin: 0 auto;                       /* Centrado */
  padding-bottom: 1rem;                 /* Espacio inferior */
}

/* Ajustes para pantallas muy pequeñas */
@media (max-width: 360px) {
  .products-grid {
    gap: 0.6rem;
    padding: 0 0.5rem 1rem;
  }
}

/* 
 * Estilos base para móviles
 * Se muestran 2 columnas por defecto en móviles
 */

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

/* 
 * Media Queries para diseño responsivo
 * Ajustes para diferentes tamaños de pantalla
 */
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

/* Tarjeta de producto individual */
.product-card {
  background: white;                            /* Fondo blanco */
  border-radius: 0.5rem;                      /* Radio de borde suave */
  overflow: hidden;                           /* Oculta el desbordamiento */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);  /* Sombra suave */
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* Transición suave */
  display: flex;                              /* Usa flexbox para el diseño */
  flex-direction: column;                     /* Organiza los elementos en columna */
  height: 100%;                               /* Ocupa toda la altura disponible */
  font-size: 0.9em;                           /* Tamaño de fuente base */
  border: 1px solid #f0f0f0;                  /* Borde sutil */
  position: relative;                         /* Para posicionar elementos absolutos */
}

/* Efecto hover para dispositivos con hover */
@media (hover: hover) and (pointer: fine) {
  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
}

/* Contenedor de la imagen del producto */
.product-image-container {
  position: relative;              /* Posicionamiento relativo para elementos hijos absolutos */
  width: 100%;                    /* Ancho completo */
  overflow: hidden;               /* Oculta el desbordamiento */
  border-radius: 0.5rem 0.5rem 0 0; /* Bordes redondeados solo arriba */
  padding-top: 100%;              /* Crea un cuadrado perfecto (relación de aspecto 1:1) */
  background: #fafafa;            /* Fondo gris muy claro */
  border-bottom: 1px solid #f0f0f0; /* Línea sutil de separación */
}

/* Imagen del producto */
.product-image {
  position: absolute;      /* Posicionamiento absoluto dentro del contenedor */
  top: 50%;               /* Centrado vertical */
  left: 50%;              /* Centrado horizontal */
  width: 85%;             /* Ancho reducido */
  height: 85%;            /* Altura reducida */
  transform: translate(-50%, -50%); /* Centrado perfecto */
  object-fit: contain;    /* Ajusta la imagen manteniendo la proporción */
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* Transición suave */
  will-change: transform; /* Optimización de rendimiento */
}

/* Efecto hover para la imagen */
@media (hover: hover) and (pointer: fine) {
  .product-card:hover .product-image {
    transform: translate(-50%, -50%) scale(1.03);
  }
}

/* Overlay que aparece al pasar el ratón sobre la imagen */
.product-overlay {
  position: absolute;            /* Posicionamiento absoluto */
  top: 0;                       /* Sin margen superior */
  left: 0;                      /* Sin margen izquierdo */
  right: 0;                     /* Sin margen derecho */
  bottom: 0;                    /* Sin margen inferior */
  background: rgba(0, 0, 0, 0.6); /* Fondo semitransparente más oscuro */
  display: flex;                /* Usa flexbox para centrar */
  align-items: center;          /* Centrado vertical */
  justify-content: center;      /* Centrado horizontal */
  opacity: 0;                   /* Inicialmente invisible */
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Transición suave */
  z-index: 2;                   /* Asegura que esté por encima de la imagen */
}

/* Botón dentro del overlay */
.overlay-btn {
  background: rgba(255, 255, 255, 0.95);
  color: #4f46e5;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  transform: translateY(10px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto hover para el overlay */
@media (hover: hover) and (pointer: fine) {
  .product-card:hover .product-overlay {
    opacity: 1;
  }
  
  .product-card:hover .overlay-btn {
    transform: translateY(0);
    opacity: 1;
    transition-delay: 0.1s;
  }
  
  .overlay-btn:hover {
    background: white;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  .overlay-btn:active {
    transform: translateY(0) !important;
  }
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

/* Contenedor de la información del producto */
.product-info {
  padding: 0.75rem 0.8rem; /* Espaciado interno mejorado */
  flex-grow: 1;           /* Ocupa el espacio restante */
  display: flex;          /* Usa flexbox */
  flex-direction: column; /* Organiza los elementos en columna */
  justify-content: space-between; /* Distribuye el espacio verticalmente */
  min-height: 90px;       /* Altura mínima adecuada */
  position: relative;     /* Para posicionar elementos absolutos */
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 360px) {
  .product-info {
    padding: 0.6rem 0.7rem;
    min-height: 85px;
  }
}

/* Nombre del producto */
.product-name {
  font-size: 0.78rem;            /* Tamaño de fuente legible */
  font-weight: 500;              /* Peso de fuente más fino */
  color: #2d3748;                /* Color de texto oscuro mejorado */
  margin: 0 0 0.15rem 0;         /* Márgenes ajustados */
  line-height: 1.25;             /* Altura de línea mejorada */
  display: -webkit-box;          /* Compatibilidad con navegadores antiguos */
  -webkit-line-clamp: 2;         /* Límite de 2 líneas */
  -webkit-box-orient: vertical;   /* Orientación vertical */
  overflow: hidden;              /* Oculta el texto que se desborda */
  text-overflow: ellipsis;       /* Añade puntos suspensivos */
  max-height: 2.5em;             /* Altura máxima para 2 líneas */
  line-clamp: 2;                /* Estándar moderno */
  letter-spacing: -0.01em;       /* Espaciado entre letras más ajustado */
  transition: color 0.2s ease;   /* Transición suave para hover */
}

/* Efecto hover para el nombre */
@media (hover: hover) and (pointer: fine) {
  .product-card:hover .product-name {
    color: #4f46e5; /* Color más vivo al hacer hover */
  }
}

/* Contenedor para nombre y precio */
.product-details {
  margin-top: auto;             /* Empuja el contenedor hacia abajo */
}

/* Precio del producto */
.product-price {
  font-size: 0.85rem;           /* Tamaño de fuente ligeramente mayor */
  font-weight: 600;             /* Peso de fuente mejorado */
  color: #6d28d9;               /* Color morado más profesional */
  margin: 0.2rem 0 0 0;         /* Márgenes mejorados */
  display: block;               /* Asegura que ocupe su propia línea */
  position: relative;           /* Para efectos adicionales */
  transition: color 0.2s ease;  /* Transición suave */
}

/* Efecto hover para el precio */
@media (hover: hover) and (pointer: fine) {
  .product-card:hover .product-price {
    color: #5b21b6; /* Color más oscuro al hacer hover */
  }
}

/* Ajustes para pantallas más grandes */
@media (min-width: 768px) {
  .product-info {
    padding: 0.6rem;
    min-height: auto;
  }
  
  .product-name {
    font-size: 0.85rem;
    margin: 0 0 0.1rem 0;
  }
  
  .product-price {
    font-size: 1rem;
    margin: 0.2rem 0 0.5rem 0;
  }
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

/* Botón de consulta */
.add-to-cart-btn {
  width: 100%;                                  /* Ancho completo */
  background: linear-gradient(135deg, #7c3aed, #6d28d9); /* Degradado morado mejorado */
  color: white;                                /* Texto blanco */
  border: none;                                /* Sin borde */
  padding: 0.7rem 1rem;                        /* Aumentado el espaciado vertical */
  border-radius: 0.5rem;                       /* Bordes más redondeados */
  font-weight: 500;                            /* Peso de fuente mejorado */
  cursor: pointer;                             /* Cursor tipo puntero */
  display: flex;                               /* Usa flexbox */
  align-items: center;                         /* Centrado vertical */
  justify-content: center;                     /* Centrado horizontal */
  gap: 0.5rem;                                 /* Espacio entre icono y texto */
  font-size: 0.9rem;                           /* Tamaño de fuente aumentado */
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* Transición suave */
  margin: 0.7rem 0 0.3rem 0;                   /* Ajuste de márgenes */
  white-space: nowrap;                         /* Evita el salto de línea */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);    /* Sombra más pronunciada */
  position: relative;                          /* Para efectos */
  -webkit-tap-highlight-color: transparent;    /* Elimina el resaltado en móviles */
  touch-action: manipulation;                  /* Mejora la respuesta táctil */
  min-height: 2.8rem;                          /* Altura mínima para mejor toque */
  z-index: 1;                                  /* Para efectos */
}

/* Ajuste para pantallas muy pequeñas */
@media (max-width: 360px) {
  .add-to-cart-btn {
    padding: 0.65rem 0.9rem;
    font-size: 0.85rem;
    min-height: 2.6rem;
  }
}

/* Efecto hover para el botón */
.add-to-cart-btn {
  background: linear-gradient(135deg, #6d28d9, #5b21b6);
}

/* Efecto para pantallas táctiles */
@media (hover: none) and (pointer: coarse) {
  .add-to-cart-btn:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

/* Efecto para pantallas con mouse */
@media (hover: hover) and (pointer: fine) {
  .add-to-cart-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }
  
  .add-to-cart-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

/* Efecto de pulsación mejorado para pantallas táctiles */
@media (hover: none) and (pointer: coarse) {
  .add-to-cart-btn:active {
    transform: scale(0.97);
    opacity: 0.9;
    transition: transform 0.1s ease, opacity 0.1s ease;
  }
}

/* Icono dentro del botón */
.add-to-cart-btn .btn-icon {
  transition: transform 0.2s ease;
  width: 1.1em;  /* Tamaño del icono ligeramente mayor */
  height: 1.1em; /* Mantener la proporción */
}

/* Efecto hover para el icono */
@media (hover: hover) and (pointer: fine) {
  .add-to-cart-btn:hover .btn-icon {
    transform: translateX(2px);
  }
}

/* Mejora de accesibilidad para el botón */
.add-to-cart-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.4);
}

/* Asegurar que el botón sea fácil de tocar en móviles */
@media (max-width: 480px) {
  .add-to-cart-btn {
    min-width: 44px;  /* Tamaño mínimo recomendado para toques */
    min-height: 44px; /* Tamaño mínimo recomendado para toques */
  }
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