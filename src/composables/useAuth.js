import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) throw authError
      user.value = data.user
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  // Check current user on init
  const checkUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkUser
  }
}
