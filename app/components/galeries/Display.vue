<template>
  <div>
    <NuxtLink to="/galeries" ><AkArrowLeft class="absolute text-4xl m-4 hover:text-accent-500 transition-colors"/></NuxtLink>
    <h1 class="text-3xl md:text-4xl lg:text-5xl text-center mt-8">
      {{ gallery.data.name }}
    </h1>
    <h2 v-if="gallery.data.photographer" class="text-xl md:text-2xl lg:text-3xl text-center mt-4">
      {{ gallery.data.photographer }}
    </h2>
    <PagesLottieLoader v-show="pending" class="h-screen" />
    <div
      v-show="!pending"
      class="columns-2 md:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4 p-4 md:p-8"
    >
      <div
        v-for="(galleryMedia, index) in gallery.data.media"
        :key="galleryMedia.id"
        class="w-full rounded-xl shadow relative overflow-hidden bg-gray-100"
      >
        <NuxtImg
          v-bind="getImageConfig(galleryMedia, index)"
          :alt="generateImageAlt(galleryMedia.name, index)"
          :title="generateImageTitle(galleryMedia.name)"
          class="bg-white h-auto max-w-full rounded-lg transition-all duration-500 ease-out"
          width="800"
          @load="onImageLoad"
        />
      </div>
    </div>
    <NuxtLink to="/galeries" ><p class="text-xl md:text-2xl lg:text-3xl text-center hover:text-accent-500 transition-colors mt-12">Retour aux galleries</p></NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { AkArrowLeft } from '@kalimahapps/vue-icons';
import type { Gallery, Media } from '~/types/models'

  const props = defineProps<{
    gallery: Gallery
  }>()

  const pending = ref(true)
  const loadedCount = ref(0)
  const REVEAL_THRESHOLD = 4
  const SAFETY_TIMEOUT = 2000

  // Get responsive image config for each gallery media item
  function getImageConfig(galleryMedia: Media, index: number) {
    return useResponsiveImage(galleryMedia, 'detail', {
      eager: index === 0,
      customSizes: '(min-width: 768px) 25vw, 50vw',
    })
  }

  function onImageLoad() {
    loadedCount.value++
    if (loadedCount.value >= REVEAL_THRESHOLD) {
      pending.value = false
    }
  }

  onMounted(() => {
    setTimeout(() => {
      pending.value = false
    }, SAFETY_TIMEOUT)
  })

  const author = computed(() => {
    return props.gallery.data.photographer || 'Cécile Devaux - Pensée Bohème'
  })

  // SEO helper functions
  const generateImageAlt = (originalName: string, index: number): string => {
    const cleanName = originalName.replace(/\.(jpg|jpeg|png|webp)$/i, '')
    return `${cleanName} - Création florale Pensée Bohème ${
      index + 1
    } - Fleuriste artisanale Normandie`
  }

  const generateImageTitle = (originalName: string): string => {
    const cleanName = originalName.replace(/\.(jpg|jpeg|png|webp)$/i, '')
    return `${cleanName} par ${author.value} - Pensée Bohème`
  }
</script>
