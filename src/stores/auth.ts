import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string>('')

  const checkAuth = async () => {
    try {
      loading.value = true
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
      isAuthenticated.value = !!session
      return isAuthenticated.value
    } catch (err: unknown) {
      console.error('Auth error:', err)
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = ''
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      user.value = data.user
      isAuthenticated.value = true
      return { success: true }
    } catch (err: unknown) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      
      user.value = null
      isAuthenticated.value = false
      return { success: true }
    } catch (err: unknown) {
      console.error('Logout error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state
  const init = async () => {
    await checkAuth()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
      isAuthenticated.value = !!session
    })

    // Cleanup subscription on unmount
    return () => subscription?.unsubscribe()
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    checkAuth,
    login,
    logout,
    init
  }
})
