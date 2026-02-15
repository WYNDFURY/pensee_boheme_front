export const useAdminApi = () => {
  const { token, logout } = useAuth()
  const config = useRuntimeConfig()
  const toast = useToast()

  const request = async <T>(
    endpoint: string,
    options: any = {}
  ): Promise<T> => {
    try {
      const response = await $fetch<T>(endpoint, {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json',
          ...options.headers,
        },
        ...options,
      })
      return response
    } catch (error: any) {
      // Handle 401: token invalid/expired
      if (error?.response?.status === 401) {
        toast.add({
          title: 'Session expirée',
          description: 'Veuillez vous reconnecter',
          color: 'error',
        })
        await logout()
        navigateTo('/admin/login')
        throw error
      }

      // Handle 422: validation errors
      if (error?.response?.status === 422) {
        // Return error to let component handle field-level display
        throw error
      }

      // Generic error
      toast.add({
        title: 'Erreur',
        description: error?.data?.message || 'Une erreur est survenue',
        color: 'error',
      })
      throw error
    }
  }

  return {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, body: any) =>
      request<T>(endpoint, {
        method: 'POST',
        body,
      }),

    patch: <T>(endpoint: string, body: any) =>
      request<T>(endpoint, {
        method: 'PATCH',
        body,
      }),

    delete: <T>(endpoint: string) =>
      request<T>(endpoint, { method: 'DELETE' }),

    // Special handler for multipart/form-data uploads
    upload: async <T>(endpoint: string, formData: FormData, method: 'POST' | 'PATCH' = 'POST'): Promise<T> => {
      return request<T>(endpoint, {
        method,
        body: formData,
        // Don't set Content-Type — browser sets it with boundary for FormData
        // Note: Authorization header is added by the base request() function
      })
    },
  }
}
