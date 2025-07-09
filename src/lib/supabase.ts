import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Initialize Supabase client with hardcoded values
const supabaseUrl = 'https://miihnmnbpohfqtnatjix.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paWhubW5icG9oZnF0bmF0aml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NDAxODQsImV4cCI6MjA2NzUxNjE4NH0.Da0IljqI6qqiXoTBL5NevG0jnHjEcuprK7sDlewYyT8'

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'mg-bisuterias-admin/1.0.0',
      },
    },
  }
)

// Storage bucket name
export const STORAGE_BUCKET = 'product-images'

// Admin credentials from environment variables
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

// Function to sign in as admin
export const signInAsAdmin = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Admin credentials not configured')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })
  
  if (error) {
    console.error('Error signing in as admin:', error.message)
    throw error
  }
  
  return data
}

// Helper function to handle file uploads
export const uploadFile = async (file: File, path: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `${path}/${fileName}`
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file)

  if (error) {
    throw error
  }

  return data
}

// Helper function to get public URL
export const getPublicUrl = (filePath: string) => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

// Helper function to delete a file
export const deleteFile = async (filePath: string) => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath])
  
  if (error) {
    console.error('Error deleting file:', error.message)
    throw error
  }
}

// Export types for better TypeScript support
export type Product = {
  id?: string
  name: string
  description: string
  price: number
  image_url: string
  created_at?: string
  updated_at?: string
}
