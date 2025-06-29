<template>
  <div>
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
          :alt="generateImageAlt(galleryMedia.name, index)"
          :title="generateImageTitle(galleryMedia.name)"
          loading="lazy"
          :src="galleryMedia.url"
          class="bg-white h-auto max-w-full rounded-lg transition-all duration-500 ease-out"
          width="800"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Gallery } from '~/types/models'

  const props = defineProps<{
    gallery: Gallery
  }>()

  const pending = ref(true)

  onMounted(() => {
    setTimeout(() => {
      pending.value = false
    }, 1500)
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
