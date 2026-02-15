# Nuxt UI v3

Component library for Vue 3 and Nuxt 3 built on Reka UI (headless) + Tailwind CSS v4 + Tailwind Variants.

**Version coverage:** v3.3.2 (stable)
**Official docs:** https://ui3.nuxt.com/

## When to Use

- Installing/configuring @nuxt/ui v3
- Using UI components (Button, Card, Table, Form, Select, etc.)
- Customizing theme (colors, variants, CSS variables)
- Building forms with validation
- Using overlays (Modal, Toast, Slideover)
- Working with composables (useToast, useSlideover)

**For Vue component patterns:** use `vue-best-practices` skill
**For Nuxt routing/server:** use `nuxt` skill

## Available Guidance

| File                                                         | Topics                                                                           |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **[references/installation.md](references/installation.md)** | Setup, configuration, UApp wrapper, module options                               |
| **[references/forms.md](references/forms.md)**               | Form components, validation (Zod/Valibot), UForm patterns                        |
| **[components/select.md](components/select.md)**             | USelect dropdown - CRITICAL: uses `items` prop, not `options`                    |
| **[components/button.md](components/button.md)**             | UButton component props and variants                                             |
| **[components/input.md](components/input.md)**               | UInput, UTextarea components                                                     |
| **[components/file-upload.md](components/file-upload.md)**   | UFileUpload - file upload with drag & drop, validation, preview                  |
| **[components/table.md](components/table.md)**               | UTable component (TanStack Table v8)                                             |
| **[components/modal.md](components/modal.md)**               | UModal overlay component                                                         |

## Key Concepts

| Concept           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| UApp              | Required wrapper component for Toast, Tooltip, overlays    |
| Tailwind Variants | Type-safe styling with slots, variants, compoundVariants   |
| Semantic Colors   | primary, secondary, success, error, warning, info, neutral |
| Reka UI           | Headless component primitives (accessibility built-in)     |

## Critical Patterns

### USelect - MUST use `items` prop
```vue
<!-- CORRECT -->
<USelect v-model="value" :items="options" />

<!-- WRONG - will not work -->
<USelect v-model="value" :options="options" />
```

### UTable - MUST use `data` prop
```vue
<!-- CORRECT -->
<UTable :data="products" :columns="columns" />

<!-- WRONG -->
<UTable :rows="products" :columns="columns" />
```

## Quick Reference

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

```vue
<!-- app.vue - UApp wrapper required -->
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

## Resources

- [Nuxt UI v3 Docs](https://ui3.nuxt.com)
- [Component Reference](https://ui3.nuxt.com/components)
- [GitHub Repository](https://github.com/nuxt/ui)

---

_For Nuxt UI v4, use the `nuxt-ui` skill instead_
