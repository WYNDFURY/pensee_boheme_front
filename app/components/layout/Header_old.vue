<template>
  <header class="bg-secondary_green text-black relative">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo: Centered on mobile, left on desktop -->
      <div
        class="md:order-1 flex-shrink-0 md:w-auto w-full md:text-left text-center"
      >
        <NuxtLink to="/" class="inline-block">
          <img src="/logo.svg" alt="Pensée Bohème" class="h-12 md:h-16" />
        </NuxtLink>
      </div>

      <!-- Desktop Navigation - Hidden on mobile -->
      <nav
        class="hidden md:flex md:order-2 space-x-6 items-center font-['Josefin_Slab']"
      >
        <NuxtLink to="/presentation" class="hover:underline"
          >Présentation</NuxtLink
        >
        <NuxtLink to="/engagement" class="hover:underline">Engagement</NuxtLink>
        <NuxtLink to="/galerie" class="hover:underline">Galerie</NuxtLink>

        <!-- Desktop Dropdown Menu -->
        <div
          class="relative"
          @mouseenter="dropdownOpen = true"
          @mouseleave="dropdownOpen = false"
        >
          <button class="flex items-center hover:underline">
            Mon Univers Floral
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="dropdownOpen"
            class="absolute z-10 mt-2 w-60 bg-primary_green shadow-lg"
          >
            <div class="py-1">
              <NuxtLink
                to="/univers/accessoires"
                class="block px-4 py-2 hover:bg-secondary_green"
                >Accessoires Fleurs Séchées</NuxtLink
              >
              <NuxtLink
                to="/univers/mariages"
                class="block px-4 py-2 hover:bg-secondary_green"
                >Mariages</NuxtLink
              >
              <NuxtLink
                to="/univers/cadeaux"
                class="block px-4 py-2 hover:bg-secondary_green"
                >Cadeaux invités et détails personnalisés</NuxtLink
              >
              <NuxtLink
                to="/univers/professionnels"
                class="block px-4 py-2 hover:bg-secondary_green"
                >Professionnels</NuxtLink
              >
            </div>
          </div>
        </div>

        <NuxtLink to="/ateliers" class="hover:underline"
          >Ateliers Créatifs</NuxtLink
        >
        <NuxtLink to="/infos-pratiques" class="hover:underline"
          >Infos Pratiques</NuxtLink
        >
      </nav>

      <!-- Hamburger Icon - Visible only on mobile -->
      <div class="md:hidden order-2 flex justify-end">
        <button @click="mobileMenuOpen = true" aria-label="Menu">
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

    <!-- Mobile Menu Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 text-white flex flex-col"
    >
      <!-- Close Button -->
      <div class="flex justify-end p-4">
        <button
          @click="mobileMenuOpen = false"
          class="text-white"
          aria-label="Close menu"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Logo in mobile menu -->
      <div class="flex justify-center mb-4">
        <NuxtLink to="/" @click="mobileMenuOpen = false">
          <img src="/logo.svg" alt="Pensée Bohème" class="h-16 invert" />
        </NuxtLink>
      </div>

      <!-- Mobile Navigation -->
      <nav
        class="flex flex-col items-center justify-center flex-grow font-['Josefin_Slab'] space-y-6"
      >
        <NuxtLink
          @click="mobileMenuOpen = false"
          to="/presentation"
          class="text-xl"
        >
          Présentation
        </NuxtLink>
        <NuxtLink
          @click="mobileMenuOpen = false"
          to="/engagement"
          class="text-xl"
        >
          Engagement
        </NuxtLink>
        <NuxtLink @click="mobileMenuOpen = false" to="/galerie" class="text-xl">
          Galerie
        </NuxtLink>

        <!-- Mobile Dropdown -->
        <div class="w-full flex flex-col items-center">
          <button
            @click="mobileDropdownOpen = !mobileDropdownOpen"
            class="text-xl flex items-center"
          >
            Mon Univers Floral
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="mobileDropdownOpen"
            class="mt-2 flex flex-col items-center space-y-3 py-4"
          >
            <NuxtLink
              @click="mobileMenuOpen = false"
              to="/univers/accessoires"
              class="text-lg"
            >
              Accessoires Fleurs Séchées
            </NuxtLink>
            <NuxtLink
              @click="mobileMenuOpen = false"
              to="/univers/mariages"
              class="text-lg"
            >
              Mariages
            </NuxtLink>
            <NuxtLink
              @click="mobileMenuOpen = false"
              to="/univers/cadeaux"
              class="text-lg"
            >
              Cadeaux invités et détails personnalisés
            </NuxtLink>
            <NuxtLink
              @click="mobileMenuOpen = false"
              to="/univers/professionnels"
              class="text-lg"
            >
              Professionnels
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          @click="mobileMenuOpen = false"
          to="/ateliers"
          class="text-xl"
        >
          Ateliers Créatifs
        </NuxtLink>
        <NuxtLink
          @click="mobileMenuOpen = false"
          to="/infos-pratiques"
          class="text-xl"
        >
          Infos Pratiques
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false);
const dropdownOpen = ref(false);
const mobileDropdownOpen = ref(false);

// Close mobile menu when route changes
const route = useRoute();
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
    mobileDropdownOpen.value = false;
  }
);

// Prevent scrolling when mobile menu is open
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>
