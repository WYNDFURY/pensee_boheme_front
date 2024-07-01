<template>
  <header class="bg-[#204534] text-[#fafafa] py-4">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold">Pensée Bohème</h1>
        <nav class="hidden md:flex space-x-4">
          <!-- <NuxtLink to="/" class="hover:text-[#C3E8D7]">Accueil</NuxtLink> -->
          <NuxtLink :to="{ name: 'products' }" class=" hover:text-[#C3E8D7]">Produits</NuxtLink>
        </nav>
      </div>
      <div class="hidden md:flex items-center space-x-4">
        <NuxtLink :to="{ name: 'cart' }" class="hover:text-[#C3E8D7]">Panier</NuxtLink>
        <NuxtLink v-if="!userState" :to="{ name: 'signup' }" class="hover:text-[#C3E8D7]">S'enregistrer</NuxtLink>
        <NuxtLink v-if="!userState" :to="{ name: 'login' }" class="hover:text-[#C3E8D7]">Connexion</NuxtLink>
        <span v-else>Bonjour {{ userState.first_name }}</span>

      </div>
      <button class="md:hidden text-[#fafafa]" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
    <div v-if="isMenuOpen" class="md:hidden bg-[#204534] text-[#fafafa] py-2">
      <nav class="flex flex-col items-center space-y-2">
        <!-- <NuxtLink to="/" class="hover:text-[#C3E8D7]" @click="toggleMenu">Accueil</NuxtLink> -->
        <NuxtLink :to="{ name: 'products' }" class="hover:text-[#C3E8D7]" @click="toggleMenu">Produits</NuxtLink>
        <NuxtLink :to="{ name: 'cart' }" class="hover:text-[#C3E8D7]" @click="toggleMenu">Panier</NuxtLink>
        <NuxtLink v-if="!userState" :to="{ name: 'signup' }" class="hover:text-[#C3E8D7]" @click="toggleMenu">
          S'enregistrer</NuxtLink>
        <NuxtLink v-if="!userState" :to="{ name: 'login' }" class="hover:text-[#C3E8D7]" @click="toggleMenu">Connexion
        </NuxtLink>

      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { User } from '~/types/models';


const isMenuOpen = ref(false);
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;
const userState = useState<User>('user');

</script>
