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
│  app.vue                                                                │
│     └──> <UApp> + <NuxtLayout> + <NuxtPage>                           │
│             ├──> default.vue layout (public: Header, Banner, Footer)   │
│             └──> admin.vue layout (admin: top navbar, slot)            │
│                                                                          │
│  /admin/login (public, layout: false)                                  │
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
│  Logout button (top navbar, right side)                                │
│     └──> useAuth().logout()                                             │
│             ├──> POST /api/logout (revoke token)                        │
│             └──> clear localStorage → redirect /admin/login             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Layout System

```
app.vue
  └── <UApp>
        └── <NuxtLayout>           ← selects layout based on definePageMeta
              ├── default.vue      ← public pages (Header, Banner, Footer)
              └── admin.vue        ← admin pages (top navbar, slot)
```

- `app.vue` uses `<NuxtLayout>` to enable the layout system
- Public pages use `default.vue` layout automatically (no `definePageMeta` needed)
- Admin pages specify `definePageMeta({ layout: 'admin', ssr: false })`
- Login page specifies `definePageMeta({ layout: false, ssr: false })`
- Public `Header.vue` hides itself on `/admin/*` routes via `v-if="!isAdminRoute"`

### Route Structure

```
app/pages/admin/
├── login.vue                   (layout: false, ssr: false)
├── dashboard.vue               (layout: 'admin', ssr: false)
├── galleries/
│   ├── index.vue              (list with search/filter)
│   ├── create.vue             (form)
│   └── [slug]/
│       └── edit.vue           (form)
└── products/
    ├── index.vue              (list with search/filter)
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

  // Rehydrate from localStorage on page reload
  // useState initializers can miss stored values after SSR hydration
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
```

**Notes:**
- `useState` for reactive state that persists across route changes
- `import.meta.client` guards for localStorage (SSR safety)
- `onMounted` rehydration is critical: `useState` initializers can lose stored values after hydration, so we re-check localStorage in `onMounted`
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

      if (error?.response?.status === 422) {
        throw error
      }

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
      request<T>(endpoint, { method: 'POST', body }),
    patch: <T>(endpoint: string, body: any) =>
      request<T>(endpoint, { method: 'PATCH', body }),
    delete: <T>(endpoint: string) =>
      request<T>(endpoint, { method: 'DELETE' }),
    upload: async <T>(
      endpoint: string,
      formData: FormData,
      method: 'POST' | 'PATCH' = 'POST'
    ): Promise<T> => {
      return request<T>(endpoint, {
        method,
        body: formData,
        headers: { Accept: 'application/json' },
      })
    },
  }
}
```

**Notes:**
- Wraps `$fetch` with auth header injection
- Centralizes 401 handling (logout + redirect)
- Returns 422 errors to component for field-level display
- `upload()` method for FormData — does NOT set Content-Type (browser sets it with boundary)

### 2. Middleware

#### `app/middleware/auth.global.ts`

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!isAuthenticated.value) {
      return navigateTo('/admin/login')
    }
  }

  if (to.path === '/admin/login' && isAuthenticated.value) {
    return navigateTo('/admin/dashboard')
  }
})
```

### 3. Layouts

#### `app/layouts/admin.vue`

Top navbar layout with conditional rendering based on auth state:

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/admin/dashboard" class="flex items-center gap-2">
            <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-accent-500" />
            <h1 class="text-xl font-bold">
              Admin <span class="text-accent-500">Pensée Bohème</span>
            </h1>
          </NuxtLink>

          <!-- Nav (only when logged in) -->
          <nav v-if="isAuthenticated" class="flex items-center gap-6">
            <NuxtLink to="/admin/dashboard" :class="linkClass('/admin/dashboard')">Accueil</NuxtLink>
            <NuxtLink to="/admin/products" :class="linkClass('/admin/products')">Produits</NuxtLink>
            <NuxtLink to="/admin/galleries" :class="linkClass('/admin/galleries')">Galeries</NuxtLink>
          </nav>

          <!-- User menu (only when logged in) -->
          <div v-if="isAuthenticated" class="flex items-center gap-3">
            <div v-if="user" class="hidden sm:block text-right">
              <p class="text-sm font-medium">{{ user.first_name }} {{ user.last_name }}</p>
              <p class="text-xs text-gray-500">{{ user.email }}</p>
            </div>
            <UButton label="Déconnexion" color="error" variant="ghost" size="sm" @click="handleLogout" />
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>
```

**Notes:**
- Top navbar (not sidebar) — simpler, works well for 3 nav items
- Active link highlighting via `route.path.startsWith(path)` check
- `v-if="isAuthenticated"` on nav and user menu prevents flash during redirect
- Logout uses toast notification for user feedback

#### `app/layouts/default.vue`

```vue
<template>
  <div>
    <LayoutHeader class="relative z-10" />
    <slot />
    <LayoutBanner />
    <LayoutFooter />
  </div>
</template>
```

Public layout with standard Header/Banner/Footer. Used automatically by all pages that don't specify a layout.

### 4. UTable Patterns (Critical)

UTable in Nuxt UI v3 is based on **TanStack Table v8**. These patterns differ significantly from Nuxt UI v2.

#### Props

```vue
<!-- CORRECT: use :data (not :rows) -->
<UTable :data="items" :columns="columns" />
```

#### Column Definitions

```typescript
// Direct data columns — use accessorKey ONLY
{ accessorKey: 'name', header: 'Nom' }

// Virtual/custom columns — use id ONLY (no accessorKey)
{ id: 'actions', header: 'Actions' }
{ id: 'category', header: 'Catégorie' }
{ id: 'is_active', header: 'Statut' }
```

**NEVER mix `id` and `accessorKey` in the same column** — it breaks TanStack Table.

Virtual columns are: computed values, custom templates, actions, formatted data — anything that doesn't map directly to a field name.

#### Template Slots

```vue
<!-- Slot name pattern: #columnId-cell or #accessorKey-cell -->
<template #actions-cell="{ row }">
  {{ (row.original as Product).name }}
</template>

<template #is_active-cell="{ row }">
  <span>{{ (row.original as Product).is_active ? 'Actif' : 'Inactif' }}</span>
</template>
```

- Slots are `#column-cell` (NOT `#column-data`)
- Access row data via `row.original` with type assertion

#### Button Colors

```vue
<!-- CORRECT -->
<UButton color="neutral" />  <!-- not "gray" -->
<UButton color="error" />    <!-- not "red" -->

<!-- Valid colors: primary, secondary, success, error, warning, info, neutral -->
```

### 5. API Response Patterns

**Critical inconsistency between endpoints:**

| Endpoint | Response Structure | Access Pattern |
|----------|-------------------|----------------|
| `GET /galleries` | `{ data: GalleryData[] }` | `response.data` |
| `GET /galleries/:slug` | `{ data: GalleryData }` | `response.data` |
| `GET /products` | `Product[]` | Direct array |
| `GET /categories` | `Category[]` | Direct array |

Always check actual API response structure before typing. Use `ApiResponse<T>` wrapper type for gallery endpoints.

**Gallery-specific fields:**
- `media`: Array of Media objects, **limited to first 3 items** for list preview performance
- `images_count`: Total count of images in the gallery — **always use this for displaying counts**, not `media.length`

### 6. Search & Filter Pattern

List pages implement reactive filtering with computed properties:

```typescript
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const selectedStatus = ref<boolean | null>(null)

const filteredItems = computed(() => {
  let filtered = allItems.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.slug.toLowerCase().includes(query)
    )
  }
  if (selectedCategory.value !== null) {
    filtered = filtered.filter(item => item.category_id === selectedCategory.value)
  }
  if (selectedStatus.value !== null) {
    filtered = filtered.filter(item => item.is_active === selectedStatus.value)
  }
  return filtered
})
```

The UTable `:data` prop receives the computed filtered array.

## Data Models

### Types (`app/types/models.ts`)

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
  images_count?: number  // Total count (use for display, not media.length)
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
  options?: ProductOption[] | []
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  order: number
  page_id: number
  products?: Product[] | []
}

export type Media = {
  id: number
  name: string
  url: string
}

export type ProductOption = {
  id: number
  name: string
  price: number | null
  price_formatted: string | null
}

export type ApiResponse<T> = {
  data: T
}

export type Gallery = ApiResponse<GalleryData>
export type Galleries = ApiResponse<GalleryData[]>

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

- **Login form**: Catch error, display "Identifiants invalides"
- **CRUD forms**: Catch 422, let UForm display field errors automatically
- **Delete operations**: Catch generic errors, keep modal open with error toast

### Client-side validation

All forms use Zod schemas validated before API call:
- Required fields
- Email format
- String max lengths
- File size/count constraints
- Number ranges
- Cross-field validation (e.g., price required if has_price is true)

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

All admin pages: `definePageMeta({ ssr: false, layout: 'admin' })`

### Image previews

Use `FileReader` for instant client-side preview — no server roundtrip.

### No pagination needed

Backend returns all galleries (~10) and products (~20) without pagination. Admin list pages fetch full datasets and filter client-side.

## Security Considerations

### Token storage

- **localStorage** (not cookies) acceptable for single-admin use case
- No XSS risk: admin doesn't input untrusted HTML
- `import.meta.client` guards prevent SSR access attempts

### CORS

Backend already configured with `withCredentials` support. Frontend `$fetch` works with current setup.

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
