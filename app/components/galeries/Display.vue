<template>
  <div class="relative">
    <NuxtLink to="/galeries" ><AkArrowLeft class="absolute text-4xl m-4 hover:text-accent-500 transition-colors"/></NuxtLink>
    <h1 class="text-3xl md:text-4xl lg:text-5xl text-center mt-8">
      {{ gallery.name }}
    </h1>
    <h2 v-if="gallery.photographer" class="text-xl md:text-2xl lg:text-3xl text-center mt-4">
      {{ gallery.photographer }}
    </h2>
    <Transition name="loader-fade">
      <PagesLottieLoader v-if="pending" class="h-screen absolute inset-0 z-10 bg-white" />
    </Transition>
    <div class="columns-2 md:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4 p-4 md:p-8">
      <div
        v-for="(galleryMedia, index) in gallery.media"
        :key="galleryMedia.id"
        class="group w-full rounded-xl shadow relative overflow-hidden bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        @click="openLightbox(index)"
      >
        <NuxtImg
          v-bind="getImageConfig(galleryMedia, index)"
          :alt="generateImageAlt(galleryMedia.name, index)"
          :title="generateImageTitle(galleryMedia.name)"
          class="bg-white h-auto max-w-full rounded-lg transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-90"
          :class="loadedImages.has(galleryMedia.id) ? 'opacity-100' : 'opacity-0'"
          width="800"
          @load="onImageLoad(galleryMedia.id)"
        />
      </div>
    </div>
    <NuxtLink to="/galeries" ><p class="text-xl md:text-2xl lg:text-3xl text-center hover:text-accent-500 transition-colors mt-12">Retour aux galleries</p></NuxtLink>

    <GaleriesImageLightbox
      v-if="gallery.media?.length"
      :open="lightboxOpen"
      :current-media="gallery.media![lightboxIndex]"
      :current-index="lightboxIndex"
      :total="gallery.media.length"
      :has-prev="lightboxIndex > 0"
      :has-next="lightboxIndex < gallery.media.length - 1"
      @close="lightboxOpen = false"
      @prev="lightboxIndex--"
      @next="lightboxIndex++"
    />
  </div>
</template>

<script lang="ts" setup>
import { AkArrowLeft } from '@kalimahapps/vue-icons';
import type { GalleryData, Media } from '~/types/models'

  const props = defineProps<{
    gallery: GalleryData
  }>()

  const lightboxOpen = ref(false)
  const lightboxIndex = ref(0)

  function openLightbox(index: number) {
    lightboxIndex.value = index
    lightboxOpen.value = true
  }

  const pending = ref(true)
  const loadedImages = ref(new Set<number>())
  const REVEAL_THRESHOLD = 4
  const SAFETY_TIMEOUT = 2000

  // Get responsive image config for each gallery media item
  function getImageConfig(galleryMedia: Media, index: number) {
    return useResponsiveImage(galleryMedia, 'detail', {
      eager: index === 0,
      customSizes: '(min-width: 768px) 25vw, 50vw',
    })
  }

  function onImageLoad(id: number) {
    loadedImages.value.add(id)
    if (loadedImages.value.size >= REVEAL_THRESHOLD) {
      pending.value = false
    }
  }

  onMounted(() => {
    setTimeout(() => {
      pending.value = false
      // Reveal all images on safety timeout
      props.gallery.media?.forEach((m) => loadedImages.value.add(m.id))
    }, SAFETY_TIMEOUT)
  })

  const author = computed(() => {
    return props.gallery.photographer || 'Cécile Devaux - Pensée Bohème'
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

<style scoped>
  .loader-fade-leave-active {
    transition: opacity 1s ease-out;
  }
  .loader-fade-leave-to {
    opacity: 0;
  }
</style>
