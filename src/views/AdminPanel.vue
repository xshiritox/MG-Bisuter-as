<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, type Product } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Define a type for the product with all possible fields
interface NewProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  stock?: number;
  featured?: boolean;
}

const STORAGE_BUCKET = 'product-images'

const router = useRouter()
const products = ref<NewProduct[]>([])
const categories = ref<{id: string, name: string}[]>([])
const loading = ref(true)
const error = ref('')

// Group products by category
const productsByCategory = computed(() => {
  const grouped: {[key: string]: NewProduct[]} = {}
  
  // Add 'Sin categoría' as default
  grouped['Sin categoría'] = []
  
  // Initialize categories from the categories list
  categories.value.forEach(cat => {
    grouped[cat.name] = []
  })
  
  // Group products by category
  products.value.forEach(product => {
    const category = product.category || 'Sin categoría'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(product)
  })
  
  // Convert to array and sort categories
  return Object.entries(grouped)
    .filter(([_, products]) => products.length > 0) // Only show categories with products
    .sort(([catA], [catB]) => catA.localeCompare(catB)) // Sort categories alphabetically
})
const defaultCategories = [
  'Collares',
  'Pulseras',
  'Cadenas para espejuelos',
  'Adornos para estetoscopios',
  'Colgantes',
  'Llaveros'
]

// Form data
const newProduct = ref<NewProduct>({
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category: undefined,
  stock: undefined,
  featured: undefined
})

// Check if user is admin
const checkAuth = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push('/')
    return false
  }
  return true
}

// Fetch categories
const fetchCategories = async () => {
  try {
    // Primero intentamos obtener las categorías
    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (fetchError) {
      console.warn('Error fetching categories, using default categories:', fetchError);
      // Si hay un error, usamos las categorías por defecto
      categories.value = defaultCategories.map((name, index) => ({
        id: String(index + 1),
        name
      }));
    } else if (data && data.length > 0) {
      categories.value = data;
    } else {
      // Si no hay categorías, intentamos insertar las predeterminadas
      await insertDefaultCategories();
      // Y volvemos a intentar obtenerlas
      const { data: newData } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      categories.value = newData || [];
    }
  } catch (err: unknown) {
    console.error('Error in fetchCategories:', err);
    // En caso de error, usamos las categorías por defecto
    categories.value = defaultCategories.map((name, index) => ({
      id: String(index + 1),
      name
    }));
  }
};

// Insertar categorías por defecto
const insertDefaultCategories = async () => {
  try {
    const categoriesToInsert = defaultCategories.map(name => ({
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('categories')
      .insert(categoriesToInsert);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error inserting default categories:', error);
    return false;
  }
};

// Fetch products
const fetchProducts = async () => {
  try {
    loading.value = true
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (fetchError) throw fetchError
    products.value = data || []
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    error.value = 'Error al cargar productos: ' + errorMessage
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

// Add new product
const addProduct = async () => {
  try {
    error.value = ''
    loading.value = true
    
    // Validate required fields
    if (!newProduct.value.name || !newProduct.value.description || !newProduct.value.price) {
      throw new Error('Por favor completa todos los campos requeridos')
    }
    
    // Create product data with proper types
    const productData: NewProduct = {
      name: String(newProduct.value.name),
      description: String(newProduct.value.description),
      price: Number(newProduct.value.price),
      image_url: newProduct.value.image_url || '',
      category: newProduct.value.category || undefined,
      stock: newProduct.value.stock ? Number(newProduct.value.stock) : undefined,
      featured: Boolean(newProduct.value.featured)
    }
    
    // Insert product
    const { data, error: insertError } = await supabase
      .from('products')
      .insert([productData])
      .select()
    
    if (insertError) throw insertError
    
    // Reset form and refresh list
    newProduct.value = { name: '', description: '', price: 0, image_url: '', category: undefined, stock: undefined, featured: undefined }
    await fetchProducts()
    
    // Show success message
    error.value = ''
    alert('¡Producto agregado exitosamente!')
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido al agregar el producto'
    error.value = errorMessage
    console.error('Error adding product:', err)
  } finally {
    loading.value = false
  }
}

// Delete product
const deleteProduct = async (product: NewProduct) => {
  if (!confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) return
  
  try {
    loading.value = true
    
    // First delete the product image from storage if it exists
    if (product.image_url) {
      try {
        // Extract the file path from the URL
        let filePath = '';
        
        // If it's a full URL, extract the path after the bucket name
        if (product.image_url.includes(STORAGE_BUCKET)) {
          const url = new URL(product.image_url);
          // Get the path after the bucket name
          const pathParts = url.pathname.split(STORAGE_BUCKET + '/');
          if (pathParts.length > 1) {
            filePath = pathParts[1];
          }
        } else {
          // If it's a relative path, use it as is
          filePath = product.image_url;
        }
        
        // Remove any leading slashes
        filePath = filePath.replace(/^\/+/, '');
        
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);
            
          if (storageError) throw storageError;
        }
      } catch (err) {
        console.warn('Could not delete image from storage:', err);
      }
    }
    
    // Then delete the product from the database
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);
    
    if (deleteError) throw deleteError;
    
    // Refresh the product list
    await fetchProducts();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    error.value = 'Error al eliminar producto: ' + errorMessage;
    console.error('Error deleting product:', err);
  } finally {
    loading.value = false;
  }
}

// Format price for display
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

// Handle image upload
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) {
    error.value = 'No se seleccionó ningún archivo'
    return
  }
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    error.value = 'Formato de imagen no válido. Usa JPG, PNG, WebP o GIF'
    return
  }
  
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    error.value = 'La imagen no debe pesar más de 5MB'
    return
  }
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Debes iniciar sesión para subir imágenes')
    }
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `products/${fileName}`
    
    // Show loading state
    const loadingMessage = 'Subiendo imagen...'
    error.value = loadingMessage
    
    // Get the current session to include the access token
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('No se pudo obtener la sesión actual')
    }
    
    // Function to handle the actual file upload
    const uploadFile = async (path: string, file: File) => {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
      return { data, error }
    }
    
    // First upload attempt
    const { data: uploadData, error: uploadError } = await uploadFile(filePath, file)

    if (uploadError) {
      // If unauthorized, try to refresh the session and retry
      const errorObj = uploadError as any;
      const isUnauthorized = errorObj.statusCode === '401' || 
                           errorObj.status === 401 || 
                           uploadError.message?.includes('unauthorized');
      
      if (isUnauthorized) {
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.')
        
        // Retry the upload with the new session
        const { data: retryData, error: retryError } = await uploadFile(filePath, file)
        
        if (retryError) throw retryError
        if (!retryData) throw new Error('No se pudo subir la imagen')
        
        // Get public URL for the retried upload
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(retryData.path)
          
        newProduct.value = {
          ...newProduct.value,
          image_url: publicUrl
        } as Product
      } else {
        throw uploadError
      }
    } else if (uploadData) {
      // Get public URL for the successful upload
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path)
        
      newProduct.value = { ...newProduct.value, image_url: publicUrl }
    } else {
      throw new Error('No se pudo subir la imagen')
    }
    
    error.value = '' // Clear any previous errors
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen'
    error.value = errorMessage
    console.error('Error uploading image:', err)
    // Reset file input on error
    target.value = ''
  }
}

onMounted(async () => {
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    try {
      // Cargar productos y categorías en paralelo
      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (err) {
      console.error('Error in onMounted:', err);
      error.value = 'Error al cargar los datos. Algunas funciones pueden no estar disponibles.';
    }
  }
});
</script>

<template>
  <AdminLayout>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="admin-content">
      <!-- Add Product Form -->
      <div class="card">
        <h2>Agregar Nuevo Producto</h2>
        <form @submit.prevent="addProduct" class="product-form">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="newProduct.name" required>
          </div>
          
          <div class="form-group">
            <label>Descripción:</label>
            <textarea v-model="newProduct.description" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Precio:</label>
              <input v-model="newProduct.price" type="number" step="0.01" required>
            </div>
            
            <div class="form-group">
              <label>Categoría:</label>
              <select v-model="newProduct.category" class="form-select" required>
                <option value="" disabled>Selecciona una categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
              <p v-if="!categories.length" class="text-sm text-gray-500 mt-1">
                Cargando categorías...
              </p>
            </div>
            
            <div class="form-group">
              <label for="image">Imagen del producto</label>
              <div v-if="newProduct.image_url" class="image-preview">
                <img :src="newProduct.image_url" alt="Vista previa" class="preview-image">
                <button 
                  type="button" 
                  class="remove-image-btn"
                  @click="newProduct.image_url = ''"
                  aria-label="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
              <input 
                id="image" 
                type="file" 
                accept="image/*"
                @change="handleImageUpload"
                class="file-input"
                required
              >
              <div class="file-input-label" v-if="!newProduct.image_url">
                <span>Haz clic para subir una imagen</span>
              </div>
            </div>
          </div>
          
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Guardando...' : 'Agregar Producto' }}
          </button>
        </form>
      </div>

      <!-- Products List -->
      <div class="card">
        <h2>Productos</h2>
        
        <div v-if="loading && !products.length" class="loading">
          Cargando productos...
        </div>
        
        <div v-else-if="!products.length" class="empty-state">
          No hay productos registrados
        </div>
        
        <div v-else class="categories-container">
          <div v-for="[category, categoryProducts] in productsByCategory" :key="category" class="category-section">
            <h3 class="category-title">{{ category }}</h3>
            <div class="products-grid">
              <div v-for="(product, index) in categoryProducts" :key="product.id || index" class="product-card">
                <img :src="product.image_url" :alt="product.name" class="product-image">
                <div class="product-details">
                  <h4>{{ product.name }}</h4>
                  <p class="product-description">{{ product.description }}</p>
                  <p class="product-price">{{ formatPrice(product.price) }}</p>
                </div>
                <button 
                  @click="deleteProduct(product)" 
                  class="delete-btn"
                  :disabled="loading"
                >
                  <span v-if="loading" class="loading-spinner"></span>
                  {{ loading ? 'Eliminando...' : 'Eliminar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Number Input Styling */
input[type="number"] {
  /* Standard property with all vendor prefixes */
  -webkit-appearance: textfield; /* Safari and Chrome */
  -moz-appearance: textfield;    /* Firefox */
  appearance: textfield;         /* Standard */
  
  /* Ensure consistent styling across browsers */
  -webkit-appearance: textfield !important; /* Force WebKit/Blink */
  -moz-appearance: textfield !important;    /* Force Firefox */
  appearance: textfield !important;         /* Force standard */
}

/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  /* Standard property with all vendor prefixes */
  -webkit-appearance: none;  /* WebKit/Blink */
  -moz-appearance: textfield; /* Firefox needs textfield to hide spinners */
  appearance: none;          /* Standard */
  margin: 0;
  
  /* Ensure consistent styling across browsers */
  -webkit-appearance: none !important;
  -moz-appearance: textfield !important;
  appearance: none !important;
}

.admin-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.admin-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  padding: 2rem;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  margin-bottom: 2rem;
}

.card h2 {
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  padding: 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  display: block;
  width: 100%;
}

.product-form {
  display: grid;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #475569;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
  display: block;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

input,
select,
textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: #1e293b;
  transition: all 0.2s ease;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background-color: #f8fafc;
}

input:hover,
select:hover,
textarea:hover {
  border-color: #cbd5e1;
}

textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #93c5fd;
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
}

.category-section {
  width: 100%;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.product-details {
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-details h4 {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
  font-weight: 600;
  line-height: 1.4;
}

/* Product description with line clamping */
.product-description {
  /* Text styling */
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  
  /* Line clamping with fallbacks */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.5em;
  
  /* Ensure proper flex behavior */
  flex-grow: 1;
}

.product-price {
  font-weight: 600;
  color: #1f2937;
  margin: 0.25rem 0 0;
  font-size: 1.125rem;
}

.delete-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border: none;
  border-top: 1px solid #fecaca;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #f3f4f6;
  color: #6b7280;
  border-color: #e5e7eb;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  font-size: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ef4444;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .card {
    padding: 1.25rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.25rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>
