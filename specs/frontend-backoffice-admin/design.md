# Frontend Admin Backoffice — Design

## Overview

Admin dashboard for Pensée Bohème CMS built as a client-side SPA within the existing Nuxt 3 app. Token-based authentication using Laravel Sanctum backend API. CRUD interfaces for galleries (multi-image) and products (single-image + category). No SSR/SSG for admin routes — all rendering client-side.

**Core flow**: Login → store token → protected routes check token → CRUD pages fetch/mutate via authenticated API → logout revokes token.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend (Nuxt 3)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  /admin/login (public)                                                  │
│     │                                                                    │
│     └──> useAuth().login(email, pass)                                   │
│             │                                                            │
│             └──> POST /api/login                                         │
│                     └──> store token + user in localStorage             │
│                             └──> redirect /admin/dashboard              │
│                                                                          │
│  /admin/*  (protected by middleware)                                    │
│     │                                                                    │
│     ├──> auth.global.ts middleware                                      │
│     │       └──> check localStorage token                               │
│     │              ├──> no token → redirect /admin/login                │
│     │              └──> has token → allow                               │
│     │                                                                    │
│     └──> Page components                                                │
│             │                                                            │
│             ├──> useAdminApi().get/post/patch/delete()                  │
│             │       └──> $fetch with Authorization: Bearer {token}      │
│             │              └──> Laravel API (auth:sanctum middleware)   │
│             │                                                            │
│             └──> On 401 response                                         │
│                     └──> useAuth().logout()                             │
│                             └──> clear token → redirect /admin/login    │
│                                                                          │
│  Logout button                                                          │
│     └──> useAuth().logout()                                             │
│             ├──> POST /api/logout (revoke token)                        │
│             └──> clear localStorage → redirect /admin/login             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Route Structure

```
app/pages/admin/
├── login.vue                   (public, SSR disabled)
├── dashboard.vue               (protected)
├── galleries/
│   ├── index.vue              (list)
│   ├── create.vue             (form)
│   └── [slug]/
│       └── edit.vue           (form)
└── products/
    ├── index.vue              (list)
    ├── create.vue             (form)
    └── [id]/
        └── edit.vue           (form)
```

## Components and Interfaces

### 1. Composables

#### `app/composables/useAuth.ts`

```typescript
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

// Types
interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
}

interface LoginResponse {
  token: string
  user: AuthUser
}
```

**Notes:**
- `useState` for reactive state that persists across route changes
- `import.meta.client` guards for localStorage (SSR safety)
- `readonly()` exposes state to prevent external mutation
- Logout always clears local state even if API fails (fail-safe)

#### `app/composables/useAdminApi.ts`

```typescript
export const useAdminApi = () => {
  const { token, logout } = useAuth()
  const config = useRuntimeConfig()
  const toast = useToast()

  const request = async <T>(
    endpoint: string,
    options: RequestInit & { body?: any } = {}
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
        headers: {
          Accept: 'application/json',
        },
      })
    },
  }
}
```

**Notes:**
- Wraps `$fetch` with auth header injection
- Centralizes 401 handling (logout + redirect)
- Returns 422 errors to component for field-level display
- `upload()` method for FormData (multipart/form-data)

### 2. Middleware

#### `app/middleware/auth.global.ts`

```typescript
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
```

### 3. Pages

#### `app/pages/admin/login.vue`

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-bgcolor">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-semibold text-center mb-6">
        Admin Pensée Bohème
      </h1>

      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="admin@pensee-boheme.fr" />
        </UFormField>

        <UFormField label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" placeholder="••••••••" />
        </UFormField>

        <UButton
          type="submit"
          label="Se connecter"
          color="primary"
          block
          :loading="loading"
        />
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: false, // No default layout for login
  ssr: false,    // Client-side only
})

const { login } = useAuth()
const toast = useToast()
const loading = ref(false)

const schema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  email: '',
  password: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await login(event.data.email, event.data.password)
    toast.add({
      title: 'Connexion réussie',
      color: 'success',
    })
    navigateTo('/admin/dashboard')
  } catch (error: any) {
    toast.add({
      title: 'Erreur de connexion',
      description: error?.data?.errors?.email?.[0] || 'Identifiants invalides',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
```

#### `app/pages/admin/dashboard.vue`

```vue
<template>
  <div>
    <h1 class="text-3xl font-semibold mb-6">Dashboard</h1>

    <div class="mb-8">
      <p class="text-lg">Bienvenue, {{ user?.first_name }} {{ user?.last_name }}</p>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Galeries</h2>
        <p class="text-3xl font-bold">{{ galleriesCount }}</p>
      </div>

      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Produits</h2>
        <p class="text-3xl font-bold">{{ productsCount }}</p>
      </div>
    </div>

    <div class="space-x-4">
      <UButton
        label="Gérer les galeries"
        color="primary"
        @click="navigateTo('/admin/galleries')"
      />
      <UButton
        label="Gérer les produits"
        color="primary"
        @click="navigateTo('/admin/products')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  ssr: false,
})

const { user } = useAuth()
const api = useAdminApi()

const { data: galleries } = await useAsyncData('admin-galleries-count', () =>
  api.get<{ data: any[] }>('/galleries')
)

const { data: products } = await useAsyncData('admin-products-count', () =>
  api.get<{ data: any[] }>('/products')
)

const galleriesCount = computed(() => galleries.value?.data?.length ?? 0)
const productsCount = computed(() => products.value?.data?.length ?? 0)
</script>
```

#### `app/pages/admin/galleries/index.vue`

```vue
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-semibold">Galeries</h1>
      <UButton
        label="Créer une galerie"
        color="primary"
        @click="navigateTo('/admin/galleries/create')"
      />
    </div>

    <div v-if="pending" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      Erreur lors du chargement des galeries
    </div>

    <UTable v-else :rows="galleries" :columns="columns">
      <template #is_published-data="{ row }">
        <span :class="row.is_published ? 'text-green-600' : 'text-gray-400'">
          {{ row.is_published ? 'Oui' : 'Non' }}
        </span>
      </template>

      <template #image_count-data="{ row }">
        {{ row.media?.length ?? 0 }}
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton
            size="xs"
            color="gray"
            label="Modifier"
            @click="navigateTo(`/admin/galleries/${row.slug}/edit`)"
          />
          <UButton
            size="xs"
            color="red"
            label="Supprimer"
            @click="confirmDelete(row)"
          />
        </div>
      </template>
    </UTable>

    <UModal v-model:open="deleteModal.open">
      <template #header>
        <h3>Confirmer la suppression</h3>
      </template>
      <template #body>
        <p>Êtes-vous sûr de vouloir supprimer la galerie <strong>{{ deleteModal.gallery?.name }}</strong> ?</p>
        <p class="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton label="Annuler" color="gray" @click="deleteModal.open = false" />
          <UButton
            label="Supprimer"
            color="red"
            :loading="deleteModal.loading"
            @click="deleteGallery"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { GalleryData } from '~/types/models'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const api = useAdminApi()
const toast = useToast()

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'slug', label: 'Slug' },
  { key: 'is_published', label: 'Publié' },
  { key: 'order', label: 'Ordre' },
  { key: 'image_count', label: 'Images' },
  { key: 'actions', label: 'Actions' },
]

const { data, pending, error, refresh } = await useAsyncData('admin-galleries', () =>
  api.get<{ data: GalleryData[] }>('/galleries')
)

const galleries = computed(() => data.value?.data ?? [])

const deleteModal = ref({
  open: false,
  gallery: null as GalleryData | null,
  loading: false,
})

function confirmDelete(gallery: GalleryData) {
  deleteModal.value.gallery = gallery
  deleteModal.value.open = true
}

async function deleteGallery() {
  if (!deleteModal.value.gallery) return

  deleteModal.value.loading = true
  try {
    await api.delete(`/galleries/${deleteModal.value.gallery.slug}`)
    toast.add({
      title: 'Galerie supprimée',
      color: 'success',
    })
    deleteModal.value.open = false
    await refresh()
  } catch (error) {
    // Error already handled by useAdminApi
  } finally {
    deleteModal.value.loading = false
  }
}
</script>
```

#### `app/pages/admin/galleries/create.vue`

```vue
<template>
  <div>
    <h1 class="text-3xl font-semibold mb-6">Créer une galerie</h1>

    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-6 max-w-2xl"
    >
      <UFormField label="Nom" name="name" required>
        <UInput v-model="state.name" @input="generateSlug" />
      </UFormField>

      <UFormField label="Slug" name="slug" required>
        <UInput v-model="state.slug" />
      </UFormField>

      <UFormField label="Description" name="description">
        <UTextarea v-model="state.description" :rows="4" />
      </UFormField>

      <UFormField label="Ordre" name="order">
        <UInput v-model.number="state.order" type="number" />
      </UFormField>

      <UFormField name="is_published">
        <UCheckbox v-model="state.is_published" label="Publié" />
      </UFormField>

      <UFormField label="Images" name="images" hint="Jusqu'à 20 images, max 10 MB chacune">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          @change="onFilesChange"
          class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </UFormField>

      <!-- Image previews -->
      <div v-if="imagePreviews.length" class="grid grid-cols-3 gap-4">
        <div
          v-for="(preview, index) in imagePreviews"
          :key="index"
          class="relative aspect-square"
        >
          <img
            :src="preview"
            class="w-full h-full object-cover rounded"
            alt="Preview"
          />
          <button
            type="button"
            @click="removeImage(index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex gap-4">
        <UButton
          type="submit"
          label="Créer"
          color="primary"
          :loading="loading"
        />
        <UButton
          type="button"
          label="Annuler"
          color="gray"
          @click="navigateTo('/admin/galleries')"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const api = useAdminApi()
const toast = useToast()
const loading = ref(false)

const schema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z.string().min(1, 'Slug requis'),
  description: z.string().optional(),
  order: z.number().optional(),
  is_published: z.boolean(),
  images: z.any().optional(), // File validation handled in onFilesChange
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  name: '',
  slug: '',
  description: '',
  order: 0,
  is_published: false,
})

const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

function generateSlug() {
  if (!state.value.name) return
  state.value.slug = state.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function onFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  const files = Array.from(target.files)

  // Validate file count
  if (files.length > 20) {
    toast.add({
      title: 'Trop d\'images',
      description: 'Maximum 20 images autorisées',
      color: 'error',
    })
    return
  }

  // Validate file sizes
  const invalidFiles = files.filter(f => f.size > 10 * 1024 * 1024)
  if (invalidFiles.length > 0) {
    toast.add({
      title: 'Fichier trop volumineux',
      description: 'Chaque image doit faire maximum 10 MB',
      color: 'error',
    })
    return
  }

  imageFiles.value = files

  // Generate previews
  imagePreviews.value = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(index: number) {
  imageFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', event.data.name)
    formData.append('slug', event.data.slug)
    if (event.data.description) formData.append('description', event.data.description)
    formData.append('order', String(event.data.order ?? 0))
    formData.append('is_published', event.data.is_published ? '1' : '0')

    imageFiles.value.forEach((file) => {
      formData.append('images[]', file)
    })

    await api.upload('/galleries', formData, 'POST')

    toast.add({
      title: 'Galerie créée',
      color: 'success',
    })

    navigateTo('/admin/galleries')
  } catch (error: any) {
    // Error already handled by useAdminApi
  } finally {
    loading.value = false
  }
}
</script>
```

**Note**: `edit.vue` and product pages follow similar patterns. See full implementation in tasks document.

### 4. Layouts

#### `app/layouts/admin.vue`

```vue
<template>
  <div class="min-h-screen bg-gray-100">
    <aside class="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg">
      <div class="p-6 border-b">
        <h1 class="text-xl font-semibold">Admin Pensée Bohème</h1>
      </div>

      <nav class="p-4 space-y-2">
        <UButton
          label="Dashboard"
          color="gray"
          variant="ghost"
          block
          @click="navigateTo('/admin/dashboard')"
        />
        <UButton
          label="Galeries"
          color="gray"
          variant="ghost"
          block
          @click="navigateTo('/admin/galleries')"
        />
        <UButton
          label="Produits"
          color="gray"
          variant="ghost"
          block
          @click="navigateTo('/admin/products')"
        />
      </nav>

      <div class="absolute bottom-0 w-full p-4 border-t">
        <UButton
          label="Déconnexion"
          color="red"
          variant="ghost"
          block
          @click="handleLogout"
        />
      </div>
    </aside>

    <main class="ml-64 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth()

async function handleLogout() {
  await logout()
  navigateTo('/admin/login')
}
</script>
```

## Data Models

### Existing Types (from `app/types/models.ts`)

Used as-is:

```typescript
export type GalleryData = {
  id: number
  name: string
  photographer: string | null
  slug: string
  description: string | null
  is_published: boolean
  cover_image: Media[] | null
  order: number
  media?: Media[] | []
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number | null
  price_formatted: string | null
  is_active: boolean
  has_price: boolean
  category_id: number
  media: Media[] | []
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string
}

export type Media = {
  id: number
  name: string
  url: string
}
```

### New Types

Add to `app/types/models.ts`:

```typescript
export type AuthUser = {
  id: number
  first_name: string
  last_name: string
  email: string
}

export type LoginResponse = {
  token: string
  user: AuthUser
}

export type ApiError = {
  message: string
  errors?: Record<string, string[]>
}
```

## Error Handling

### Centralized in `useAdminApi`

| Scenario | Status | Handling |
|----------|--------|----------|
| **Token invalid/expired** | 401 | Toast + logout + redirect `/admin/login` |
| **Validation errors** | 422 | Throw to component → field-level display via UForm |
| **Network error** | - | Toast "Une erreur est survenue" + throw |
| **Other API errors** | 4xx/5xx | Toast with `error.data.message` or generic |

### Component-level

- **Login form**: Catch 422, display "Identifiants invalides"
- **CRUD forms**: Catch 422, let UForm display field errors automatically via thrown error
- **Delete operations**: Catch generic errors, keep modal open with error toast

### Client-side validation

All forms use Zod schemas validated before API call:
- Required fields
- Email format
- String max lengths
- File size/count constraints
- Number ranges

## Testing Strategy

### Unit Tests (Vitest)

**Composables:**

`useAuth.spec.ts`:
- `login()` stores token and user in localStorage
- `logout()` clears localStorage and calls API
- `isAuthenticated` computed returns true when token exists
- SSR safety: localStorage checks wrapped in `import.meta.client`

`useAdminApi.spec.ts`:
- `get/post/patch/delete()` include Authorization header
- 401 response triggers logout and redirect
- 422 response throws error without toast
- Generic errors show toast

**Middleware:**

`auth.global.spec.ts`:
- `/admin/*` without token redirects to `/admin/login`
- `/admin/login` with token redirects to `/admin/dashboard`
- Non-admin routes pass through

### E2E Tests (Playwright)

**Auth flow:**
- Login with valid credentials → dashboard
- Login with invalid credentials → error message
- Protected route without token → redirect to login
- Logout → redirect to login, token cleared

**Gallery CRUD:**
- Create gallery with images → appears in list
- Edit gallery → changes reflected
- Delete gallery → removed from list, confirmation modal required
- Form validation → required fields show errors

**Product CRUD:**
- Create product with image and category → appears in list
- Edit product → changes reflected
- Delete product → removed from list

### Manual Testing Checklist

- [ ] File upload previews work
- [ ] Multi-file upload (20 images) succeeds
- [ ] Slug auto-generation on name input
- [ ] Image deletion in edit form
- [ ] Token expiry handling (logout after 401)
- [ ] Form validation messages in French
- [ ] Toast notifications for all mutations
- [ ] Cancel buttons navigate back
- [ ] Loading states during API calls

## Performance Considerations

### Admin routes disabled from SSG

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      ignore: ['/admin/**'],
    },
  },
})
```

### Client-side rendering only

All admin pages: `definePageMeta({ ssr: false })`

### Image previews

Use `FileReader` for instant client-side preview — no server roundtrip.

### No pagination needed

Backend returns all galleries (~10) and products (~20) without pagination. Admin list pages fetch full datasets.

### Optimistic UI for deletes

Remove item from table immediately, rollback if API fails:

```typescript
const optimisticDelete = async (id: number) => {
  const originalData = [...galleries.value]
  galleries.value = galleries.value.filter(g => g.id !== id)

  try {
    await api.delete(`/galleries/${id}`)
  } catch (error) {
    galleries.value = originalData // Rollback
  }
}
```

## Security Considerations

### Token storage

- **localStorage** (not cookies) acceptable for single-admin use case
- No XSS risk: admin doesn't input untrusted HTML
- Alternative if needed: `httpOnly` cookie set by backend (requires API change)

### CORS

Backend already configured with `withCredentials` support. Frontend `$fetch` should work with current setup.

### API validation

All input validated by backend (Laravel requests). Frontend validation is UX-only, not security.

### File uploads

- Client-side validation: file type, size, count
- Backend validation: Spatie Media Library handles file validation
- No path traversal risk: backend controls storage paths

### Rate limiting

Backend handles rate limiting (`throttle:60,1` for API, `throttle:5,1` for login).

### Password handling

Never stored in frontend. Only token persisted.

## Monitoring and Observability

### Error logging

Console errors for debugging (dev only). In production, consider:

```typescript
// app/plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue error:', error, info)
    // Send to logging service (Sentry, LogRocket, etc.)
  }
})
```

### API monitoring

Backend handles logging (Laravel logs). Frontend can add:

```typescript
// In useAdminApi
const request = async () => {
  const start = Date.now()
  try {
    const response = await $fetch(...)
    console.debug(`API ${endpoint}: ${Date.now() - start}ms`)
    return response
  } catch (error) {
    console.error(`API ${endpoint} failed:`, error)
    throw error
  }
}
```

### User feedback

All mutations show toast notifications (success/error). No silent failures.
