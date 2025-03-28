<template>
  <header class="">
    <div
      class="mx-auto px-15 py-2 flex items-center justify-between bg-secondary_green text-black relative"
    >
      <!-- Logo: Centered on mobile, left on desktop with fixed width -->
      <div class="lg:text-left w-full lg:w-auto flex-shrink-0 text-center">
        <NuxtLink to="/home">
          <NuxtImg src="/logo.svg" alt="Pensée Bohème" class="h-14 px-4" />
        </NuxtLink>
      </div>

      <!-- Desktop Navigation - Hidden on mobile, will shrink -->
      <ClientOnly>
        <UNavigationMenu
          highlight
          highlight-color="primary"
          :items="items"
          class="hidden lg:flex font-['Josefin_Slab']"
          :ui="{
            link: 'text-lg',
          }"
        />
      </ClientOnly>

      <!-- Hamburger Icon - Visible only on mobile when menu is closed -->
      <div>
        <button
          class="lg:hidden flex justify-end"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Menu"
          v-if="!mobileMenuOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay with transition -->
    <div
      class="fixed inset-0 bg-black/90 text-white flex flex-col transition-all duration-300 ease-in-out"
      :class="mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'"
    >
      <!-- Logo in mobile menu -->
      <div class="flex flex-col items-center justify-center gap-5 p-5 relative">
        <button
          class="lg:hidden absolute right-0 top-0 py-10 px-5"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Close Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <NuxtLink to="/" @click="mobileMenuOpen = false">
          <img src="/logo.svg" alt="Pensée Bohème" class="h-16 invert" />
        </NuxtLink>
      </div>

      <!-- Mobile Navigation -->
      <ClientOnly>
        <UNavigationMenu
          color="neutral"
          highlight
          orientation="vertical"
          :items="items"
          class="font-['Josefin_Slab'] p-5 transition-transform duration-300"
          :class="mobileMenuOpen ? 'translate-y-0' : 'translate-y-4'"
          :ui="{
            link: 'text-lg font-light min-w-0',
          }"
        />
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { UNavigationMenu } from '#components'

  const mobileMenuOpen = ref(false)
  const mobileDropdownOpen = ref(false)

  // Close mobile menu when route changes
  const route = useRoute()
  watch(
    () => route.path,
    () => {
      mobileMenuOpen.value = false
      mobileDropdownOpen.value = false
    }
  )

  // Prevent scrolling when mobile menu is open
  onMounted(() => {
    watch(mobileMenuOpen, (isOpen) => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    })
  })

  // Navigation items for desktop menu
  const items = ref([
    [
      {
        label: 'Présentation',
        to: '/home',
      },
      {
        label: 'Engagement',
        to: '/engagement',
      },
      {
        label: 'Galerie',
        to: '/galerie',
      },
      {
        label: 'Mon Univers Floral',

        children: [
          {
            label: 'Accessoires Fleurs Séchées',
            to: '/univers/AFS',
          },
          {
            label: 'Mariages',
            to: '/univers/mariages',
          },
          {
            label: ' Détails Personnalisés & Cadeaux Invités',
            to: '/univers/cadeaux-details',
          },
          {
            label: 'Professionnels',
            to: '/univers/professionnels',
          },
        ],
      },
      {
        label: 'Ateliers Créatifs',
        to: '/ateliers-creatifs',
      },
      {
        label: 'Infos Pratiques',
        to: '/infos-pratiques',
      },
    ],
  ])
</script>
