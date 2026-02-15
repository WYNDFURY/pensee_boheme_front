import type { AuthUser, LoginResponse } from '~/types/models'

export const useAuth = () => {
  const TOKEN_KEY = 'pensee_boheme_admin_token'
  const USER_KEY = 'pensee_boheme_admin_user'

  const token = useState<string | null>('auth_token', () => {
    if (import.meta.client) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  })

  const user = useState<AuthUser | null>('auth_user', () => {
    if (import.meta.client) {
      const userData = localStorage.getItem(USER_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  // Rehydrate from localStorage on client if state is empty but localStorage has data
  if (import.meta.client) {
    onMounted(() => {
      if (!token.value) {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        if (storedToken) {
          token.value = storedToken
        }
      }
      if (!user.value) {
        const storedUser = localStorage.getItem(USER_KEY)
        if (storedUser) {
          user.value = JSON.parse(storedUser)
        }
      }
    })
  }

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const config = useRuntimeConfig()
    const response = await $fetch<LoginResponse>('/login', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: { email, password },
    })

    token.value = response.token
    user.value = response.user

    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    }
  }

  const logout = async () => {
    try {
      const config = useRuntimeConfig()
      await $fetch('/logout', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with client-side logout even if API fails
    } finally {
      token.value = null
      user.value = null

      if (import.meta.client) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  }
}
