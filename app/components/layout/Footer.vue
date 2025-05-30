<template>
  <footer class="bg-secondary_green text-white py-8 font-['Josefin_Slab']">
    <div class="container mx-auto px-4 md:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-6 text-sm">
          <NuxtLink to="/CGV" class="hover:text-accent-500 transition-colors"> CGV </NuxtLink>
          <a
            href="https://www.facebook.com/penseeboheme/"
            target="_blank"
            class="flex items-center gap-2 cursor-pointer"
          >
            <DeFacebookPlain class="text-lg bg-white" />
            <span class="hover:text-accent-500 transition-colors">Pensée Bohème</span>
          </a>
          <a
            href="https://www.instagram.com/penseeboheme/"
            target="_blank"
            class="flex items-center gap-2 cursor-pointer"
          >
            <AkInstagramFill class="text-lg" />
            <span class="hover:text-accent-500 transition-colors">Instagram</span>
          </a>
        </div>
        <!-- Contact Info -->
        <div class="flex flex-col md:flex-row gap-4 md:gap-8 text-sm md:text-base">
          <div class="flex items-center gap-2">
            <AkPhone class="text-lg" />
            <span>+33 6 14 64 35 84</span>
          </div>
          <div class="flex items-center gap-2">
            <MdTwoToneMailOutline class="text-lg" />
            <span>penseeboheme76@gmail.com</span>
          </div>
          <div class="flex items-center gap-2">
            <AkLocation class="text-lg" />
            <span>76210 Beuzeville la Grenier</span>
          </div>
        </div>

        <!-- Links -->
      </div>
    </div>
  </footer>
</template>

<script setup>
  import {
    AkPhone,
    MdTwoToneMailOutline,
    AkLocation,
    DeFacebookPlain,
    AkInstagramFill,
  } from '@kalimahapps/vue-icons'
</script>
