import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://miihnmnbpohfqtnatjix.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paWhubW5icG9oZnF0bmF0aml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NDAxODQsImV4cCI6MjA2NzUxNjE4NH0.Da0IljqI6qqiXoTBL5NevG0jnHjEcuprK7sDlewYyT8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const adminCredentials = {
  email: 'admin@mgbisuterias.com',
  password: 'admin123' // In a real app, use environment variables and stronger passwords
}
