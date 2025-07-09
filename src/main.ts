import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { supabase } from './lib/supabase'
import './style.css'

// Initialize the app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')

// Handle auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  // You can add additional auth state handling here if needed
  console.log('Auth state changed:', event, session)
})