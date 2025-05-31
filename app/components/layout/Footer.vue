<template>
  <footer class="bg-secondary_green text-white py-8 font-['Josefin_Slab']">
    <div class="container mx-auto px-4 md:px-8">
      <div class="flex flex-row justify-evenly items-center gap-6">
        <NuxtLink to="/cgv" class="hover:text-accent-500 transition-colors"> CGV </NuxtLink>
        <div class="hidden sm:flex flex-col items-start gap-6 text-sm">
          <div class="flex items-center gap-2">
            <a
              href="https://www.facebook.com/penseeboheme/"
              target="_blank"
              class="flex items-center gap-2 cursor-pointer"
            >
              <DeFacebookOriginal class="text-lg" />
              <span class="hover:text-accent-500 transition-colors">Pensée Bohème</span>
            </a>
          </div>
          <div class="flex items-center gap-2">
            <a
              href="https://www.instagram.com/penseeboheme/"
              target="_blank"
              class="flex items-center gap-2 cursor-pointer"
            >
              <AkInstagramFill class="text-lg" />
              <span class="hover:text-accent-500 transition-colors">Instagram</span>
            </a>
          </div>
        </div>
        <!-- Contact Info -->
        <div class="flex flex-col md:flex-row gap-4 md:gap-8 text-sm md:text-base">
          <div class="flex flex-col items-start gap-2">
            <div class="flex items-center">
              <AkPhone class="text-lg" />
              <span class="flex-none">+33 6 14 64 35 84</span>
            </div>
            <div class="flex items-center">
              <MdTwoToneMailOutline class="text-lg" />
              <span>penseeboheme76@gmail.com</span>
            </div>
          </div>

          <div class="flex items-center">
            <AkLocation class="text-lg" />
            <span>76210 Beuzeville la Grenier</span>
          </div>
        </div>
        <div>
          <NuxtLink @click="scrollToTop()">
            <AkArrowUp class="text-2xl" />
            <span class="sr-only">Retour en haut</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import {
    AkPhone,
    MdTwoToneMailOutline,
    AkLocation,
    DeFacebookOriginal,
    AkInstagramFill,
    AkArrowUp,
  } from '@kalimahapps/vue-icons'

  // const { slug } = useRoute().params as { slug: string }

  const { scrollToTop } = useAnchorScroll({
    toTop: {
      scrollOptions: {
        behavior: 'smooth',
        offsetTop: 0,
      },
    },
  })
</script>
