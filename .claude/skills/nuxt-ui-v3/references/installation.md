# Installation & Setup

## Nuxt 3 Installation

```bash
npm install @nuxt/ui
# or
yarn add @nuxt/ui
# or
pnpm add @nuxt/ui
```

## Configuration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

### App Wrapper (Required)

**CRITICAL**: Wrap your app in `<UApp>` for Toast, Tooltip, and overlays to work:

```vue
<!-- app.vue -->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

Without `<UApp>`, the following will not work:
- UToast
- UTooltip
- UModal
- USlideover
- UDrawer
- UCommandPalette

## Auto-installed Dependencies

Nuxt UI v3 automatically installs:
- `@nuxt/icon` - Icon system
- `@nuxtjs/color-mode` - Dark mode support (if enabled)
- Reka UI - Headless component primitives
- Tailwind CSS v4 - Styling engine
- Tailwind Variants - Component variants

## Module Options

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  ui: {
    // Component prefix (default: 'U')
    prefix: 'U',

    // Enable @nuxtjs/color-mode for dark mode
    colorMode: true,

    // Global color and size defaults
    theme: {
      colors: ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'neutral'],
      transitions: true,
      defaultVariants: {
        color: 'primary',
        size: 'md'
      }
    }
  }
})
```

## Color Mode (Dark Mode)

Enable dark mode support:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    colorMode: true
  }
})
```

Access color mode in components:

```vue
<script setup>
const colorMode = useColorMode()
</script>

<template>
  <UButton @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">
    Toggle {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }} Mode
  </UButton>
</template>
```

## Icons

Nuxt UI v3 uses `@nuxt/icon` for icons. Use Iconify icons:

```vue
<UIcon name="i-heroicons-home" />
<UIcon name="i-lucide-check" />
<UIcon name="i-mdi-account" />
```

Icon collections must be installed:

```bash
npm install @iconify-json/heroicons @iconify-json/lucide
```

Common icon sets:
- `@iconify-json/heroicons` - Heroicons
- `@iconify-json/lucide` - Lucide icons
- `@iconify-json/mdi` - Material Design Icons

## TypeScript

Nuxt UI v3 has full TypeScript support with auto-imports:

```typescript
// Auto-imported types
import type { ButtonProps, ModalProps, FormSubmitEvent } from '@nuxt/ui'
```

## Component Auto-imports

All Nuxt UI components are auto-imported:

```vue
<template>
  <!-- No imports needed -->
  <UButton>Click me</UButton>
  <UCard>Content</UCard>
  <UModal>Modal content</UModal>
</template>
```

## Composables Auto-imports

Composables are also auto-imported:

```vue
<script setup>
// Auto-imported
const toast = useToast()
const slideover = useSlideover()
const modal = useModal()

toast.add({ title: 'Success!' })
</script>
```

## SSR Considerations

### Client-Only Components

Some operations need client-side guards:

```vue
<script setup>
// Safe for SSR
const router = useRouter()

// Client-only operations
onMounted(() => {
  if (import.meta.client) {
    // localStorage, window, document operations
  }
})
</script>
```

### Admin Pages (CSR Only)

For admin panels, disable SSR:

```vue
<script setup>
definePageMeta({
  ssr: false,
  layout: 'admin'
})
</script>
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Toast not showing | Wrap app in `<UApp>` |
| Overlays broken | Ensure `<UApp>` wrapper exists |
| Icons not loading | Install icon collection packages |
| Dark mode not working | Enable `colorMode: true` in config |
| Components not importing | Check module is in `nuxt.config.ts` |
| TypeScript errors | Restart TypeScript server |

## Best Practices

1. **Always wrap in UApp** - Required for overlays and toasts
2. **Use semantic colors** - `primary`, `error`, `success`, etc.
3. **Install needed icon sets** - Don't rely on defaults
4. **Enable color mode early** - Easier than adding later
5. **Use TypeScript** - Full type safety available
6. **Configure defaults** - Set global `color` and `size` in config
7. **Client-side guards** - Use `import.meta.client` for browser APIs

## Next Steps

- Read [Forms](./forms.md) for form validation patterns
- Check [Components](../components/select.md) for component docs
- Review [Theming](#) for customization options
