<template>
  <div class="min-h-screen bg-bgcolor font-sans">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and title -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/admin/dashboard" class="flex items-center gap-2 hover:opacity-80 transition">
              <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-accent-500" />
              <h1 class="text-xl font-bold text-gray-900">
                Admin <span class="text-accent-500">Pensée Bohème</span>
              </h1>
            </NuxtLink>
          </div>

          <!-- Navigation Menu (only when logged in) -->
          <nav v-if="isAuthenticated" class="flex items-center gap-6">
            <NuxtLink
              to="/admin/dashboard"
              class="text-sm font-medium transition-colors"
              :class="isActive('/admin/dashboard') ? 'text-accent-500' : 'text-gray-700 hover:text-accent-500'"
            >
              Accueil
            </NuxtLink>
            <NuxtLink
              to="/admin/products"
              class="text-sm font-medium transition-colors"
              :class="isActive('/admin/products') ? 'text-accent-500' : 'text-gray-700 hover:text-accent-500'"
            >
              Produits
            </NuxtLink>
            <NuxtLink
              to="/admin/galleries"
              class="text-sm font-medium transition-colors"
              :class="isActive('/admin/galleries') ? 'text-accent-500' : 'text-gray-700 hover:text-accent-500'"
            >
              Galeries
            </NuxtLink>
          </nav>

          <!-- User menu (only when logged in) -->
          <div v-if="isAuthenticated" class="flex items-center gap-3">
            <div v-if="user" class="hidden sm:block text-right">
              <p class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
              <p class="text-xs text-gray-500">{{ user.email }}</p>
            </div>
            <div class="h-8 w-px bg-gray-200"/>
            <UButton
              label="Déconnexion"
              color="error"
              variant="ghost"
              size="sm"
              icon="i-heroicons-arrow-right-on-rectangle"
              @click="handleLogout"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout, user, isAuthenticated } = useAuth()
const toast = useToast()
const route = useRoute()

function isActive(path: string) {
  return route.path.startsWith(path)
}

async function handleLogout() {
  try {
    await logout()
    toast.add({
      title: 'Déconnexion réussie',
      description: 'À bientôt !',
      color: 'success',
    })
    navigateTo('/admin/login')
  } catch (error) {
    toast.add({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la déconnexion',
      color: 'error',
    })
  }
}
</script>
