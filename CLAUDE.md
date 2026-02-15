# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pensée Bohème — frontend for an eco-responsible florist website in Normandy, France. Built with **Nuxt 3** (Vue 3), **Nuxt UI v3**, and **Tailwind CSS**. The site is French-only, SSR-enabled, and statically generated for production.

## Commands

```bash
npm run dev              # Dev server at http://localhost:3000
npm run build            # Build for production
npm run generate         # Static site generation (local API)
npm run generate:prod    # Static site generation (production API: api.pensee-boheme.fr)
npm run preview          # Preview production build
npm run lint             # ESLint check
npm run lint:fix         # ESLint autofix
```

No test framework is configured.

## Architecture

### Nuxt 3 with Compatibility Version 4

The app uses Nuxt's `future.compatibilityVersion: 4` setting. Source code lives under `app/` (not root-level `components/`, `pages/`, etc.).

### Key Directories

- `app/pages/` — File-based routing. Root `/` redirects to `/home`. Dynamic route: `galeries/[slug].vue`
- `app/layouts/` — Layout system: `default.vue` for public pages (Header, Banner, Footer), `admin.vue` for admin backoffice
- `app/app.vue` — Root component using `<NuxtLayout>` to enable layout system
- `app/components/` — Organized by domain: `layout/`, `pages/`, `galeries/`, `products/`, `ateliers/`, `instagram/`, `icons/`
- `app/composables/` — Service hooks wrapping `useFetch` for API calls
- `app/api/PenseeBohemeCredentials.js` — Reads API base URL from `useRuntimeConfig().public.apiBaseUrl`
- `app/types/models.ts` — TypeScript types for API responses (`Gallery`, `Page`, `Product`, `Category`, `InstagramMedia`)
- `app/assets/css/main.css` — Global styles, Tailwind theme variables, font imports

### API Communication Pattern

All data fetching goes through composable services that use `PenseeBohemeCredentials` for the base URL and Nuxt's `useFetch`:

```
composable → PenseeBohemeCredentials (gets runtimeConfig URL) → useFetch(endpoint)
```

API endpoints consumed: `/galleries`, `/galleries/{slug}`, `/pages/{slug}`, `/instagram`

Environment variable: `NUXT_PUBLIC_API_BASE_URL` (set in `.env` for dev, overridden via `cross-env` in `generate:prod` script).

### Pre-rendered Routes

`/home`, `/galeries`, `/engagement`, `/infos-pratiques` are statically pre-rendered at build time via `nitro.prerender.routes`.

### SEO

Heavy SEO setup: `@nuxtjs/seo`, `@nuxtjs/robots`, `@nuxtjs/sitemap`. Pages use `useSeoMeta()` and `useSchemaOrg()` for structured data (LocalBusiness, Breadcrumb, WebPage schemas).

### Styling

- Tailwind CSS via Nuxt UI v3
- Custom brand colors defined in `tailwind.config.js`: `bgcolor`, `primary_green`, `secondary_green`, `accent`, `primary_orange`, `primary_pink`
- Three Google Fonts: `Josefin Slab` (brand serif), `Source Serif 4` (quotes), `Kumbh Sans` (headings)
- CSS theme variables in `app/assets/css/main.css`

### UI Libraries

- **Nuxt UI v3** (`@nuxt/ui`) — primary component library
- **Reka UI** — headless components (used alongside Nuxt UI)
- **Embla Carousel** — gallery carousel/slider
- **Zod** — form validation schemas
- **Lottie** (`@lottiefiles/dotlottie-vue`) — loading animations

## Spec-Driven Development

Feature work is documented in `specs/` before implementation. `specs/product.md` defines the product vision, target audiences, service lines, and site goals. When a new feature or significant change is requested, update `specs/product.md` if it affects the product scope (new service lines, audience shifts, changed priorities, etc.).

## Skills (`.claude/skills/`)

- **vue-best-practices** — Vue 3 Composition API patterns, `<script setup>`, reactivity, state management, performance (v-once, v-memo, virtual lists), transitions, composables. Use for any Vue component work.
- **nuxt** — Nuxt 3 reference: data fetching (`useFetch`), SSR best practices, routing, config, modules, rendering modes, deployment. Use for any Nuxt-specific work.
- **nuxt-ui** — Nuxt UI v3 (@nuxt/ui) component library reference: UButton, UModal, UForm, UTable, etc. Provides ready-to-use styled components with Tailwind Variants theming. Use when working with Nuxt UI components.
- **seo-audit** — SEO diagnostics: meta tags, structured data, technical SEO, on-page audit. Use when reviewing or improving SEO.

## Image Handling

The project uses `@nuxt/image` (NuxtImg) but has **no explicit `image` configuration** in `nuxt.config.ts` (no provider, no domains, no IPX config).

**Two image sources — different rules:**

| Source | Examples | `sizes` | `format`/`quality` |
|--------|---------|---------|-------------------|
| **Local static** (`public/`) | `/home/landpage_1.jpg`, `/AFS/AFS_Banner.jpg`, banner images | **DO NOT add `sizes`** — it activates IPX srcset generation which breaks without proper config | Safe to use |
| **API-sourced** (external URLs from backend) | Gallery photos, product images, Instagram media, atelier images | Safe to use (e.g. `sizes="50vw md:25vw"`) | Safe to use |

**Why:** Adding `sizes` to NuxtImg tells it to generate a `srcset` with multiple image variants through IPX. For local `public/` images, IPX generates broken URLs since there's no image provider configured. API-sourced images work because the browser fetches them directly at the specified sizes.

**Loading strategy:**
- Use `@load` event on NuxtImg (not `setTimeout`) to detect when images are visually ready
- Always add a safety timeout fallback (5s) in `onMounted` in case `@load` doesn't fire (e.g. cached images on back-navigation)
- For multiple images, use a threshold counter pattern (e.g. reveal after N images loaded)

## Admin Backoffice

The project includes an admin backoffice at `/admin/*` for managing galleries and products. **Key patterns:**

### Authentication
- **Composables**: `useAuth()` for token/user state (localStorage), `useAdminApi()` for authenticated API calls
- **Token storage**: localStorage with `import.meta.client` guards for SSR safety
- **Token persistence**: `onMounted` hook in `useAuth()` rehydrates state from localStorage on page reload
- **Middleware**: `auth.global.ts` protects `/admin/*` routes, redirects unauthenticated users to `/admin/login`
- **Auto-logout**: 401 responses trigger logout + redirect in `useAdminApi()`
- **Logout button**: Available in admin layout header with user info display
- **Conditional UI**:
  - Admin layout navbar and user menu use `v-if="isAuthenticated"` to prevent flash during redirect
  - Public `Header.vue` uses `v-if="!isAdminRoute"` to hide on `/admin/*` routes (admin layout has its own header)

### Admin Pages
- **All admin pages**: `definePageMeta({ ssr: false, layout: 'admin' })` — client-side only, no SSG, uses admin layout
- **Login page**: `layout: false` (uses custom layout)
- **Public pages**: Use `default` layout automatically (no need to specify) — includes Header, Banner, Footer
- **SSG exclusion**: `nitro.prerender.ignore: ['/admin/**']` in nuxt.config.ts

### Forms & Uploads
- **Validation**: Zod schemas with UForm (Nuxt UI v3)
- **File uploads**: `FormData` with `useAdminApi().upload()` for multipart/form-data
- **Slug generation**: Auto-slugify from name input using normalize + regex
- **Image previews**: `FileReader` for instant client-side previews before upload
- **Multi-image**: Array of files with previews, remove button per image

### API Patterns
- **GET/POST/PATCH/DELETE**: `useAdminApi()` methods auto-inject `Authorization: Bearer` header
- **Error handling**: 401 → logout, 422 → throw to component for field errors, others → toast
- **Optimistic UI**: Remove from list immediately on delete, rollback if API fails
- **Response structure inconsistency**:
  - Galleries: `{ data: GalleryData[] }` (use `ApiResponse<GalleryData[]>` type, access via `.data`)
  - Products/Categories: `Product[]` or `Category[]` direct arrays (no wrapper, access directly)
  - Always check actual API response structure before typing
- **Gallery data fields**:
  - `media`: Array of Media objects, limited to first 3 items for preview performance
  - `images_count`: Total count of images in the gallery (use this for displaying counts, not `media.length`)

### UTable (Nuxt UI v3)
UTable is based on TanStack Table v8. **Critical patterns:**

**Props:**
- **MUST use `data` prop** (not `rows`): `<UTable :data="products" :columns="columns" />`
- `columns`: Array of column definitions (ColumnDef from TanStack Table)
- `loading`: Boolean for loading state

**Column structure:**
- **Direct data columns**: Use `accessorKey` ONLY (e.g., `{ accessorKey: 'name', header: 'Nom' }`)
- **Virtual/custom columns**: Use `id` ONLY, no `accessorKey` (e.g., `{ id: 'actions', header: 'Actions' }`)
- **NEVER mix both** `id` and `accessorKey` in the same column - it breaks TanStack Table
- Virtual columns are: computed values, custom templates, actions, formatted data

**Template slots:**
- Slots are `#column-cell` (not `#column-data`)
- Access row data via `row.original` with type assertion: `(row.original as Type)`
- Example: `<template #actions-cell="{ row }">{{ (row.original as Product).name }}</template>`

**Button colors:**
- Use `neutral` (not `gray`) and `error` (not `red`)
- Valid colors: `primary`, `secondary`, `success`, `error`, `warning`, `info`, `neutral`

## Code Style

- Prettier: single quotes, no semicolons, 2-space indent, 100 char width, `vueIndentScriptAndStyle: true`
- ESLint: Nuxt's built-in config (`@nuxt/eslint`)
- Responsive design: mobile-first with `hidden lg:block` / `lg:hidden` patterns and touch event handlers for swipe navigation
