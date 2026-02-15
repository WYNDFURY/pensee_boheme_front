export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // Admin routes (except login) require auth
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!isAuthenticated.value) {
      return navigateTo('/admin/login')
    }
  }

  // If logged in and accessing login page, redirect to dashboard
  if (to.path === '/admin/login' && isAuthenticated.value) {
    return navigateTo('/admin/dashboard')
  }
})
