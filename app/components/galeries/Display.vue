<template>
  <div>
    <h1 class="text-3xl md:text-4xl lg:text-5xl text-center mt-8">
      {{ gallery.data.name }}
    </h1>
    <h2 v-if="gallery.data.photographer" class="text-xl md:text-2xl lg:text-3xl text-center mt-4">
      {{ gallery.data.photographer }}
    </h2>
    <div class="columns-2 md:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4 p-4 md:p-8">
      <div
        v-for="(galleryMedia, index) in gallery.data.media"
        :key="galleryMedia.id"
        class="w-full rounded-xl shadow"
        itemscope
        itemtype="https://schema.org/ImageObject"
      >
        <NuxtImg
          class="h-auto max-w-full rounded-lg"
          :src="galleryMedia.url"
          :alt="generateImageAlt(galleryMedia.name, index)"
          :title="generateImageTitle(galleryMedia.name)"
          :loading="index < 4 ? 'eager' : 'lazy'"
          :fetchpriority="index < 2 ? 'high' : 'auto'"
          itemprop="contentUrl"
          format="webp"
        />
        <meta :content="generateImageAlt(galleryMedia.name, index)" itemprop="description" />
        <meta :content="gallery.data.name" itemprop="name" />
        <meta :content="author" itemprop="author" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Gallery } from '~/types/models'

  const props = defineProps<{
    gallery: Gallery
  }>()

  const author = computed(() => {
    return props.gallery.data.photographer || 'Cécile Devaux - Pensée Bohème'
  })

  // SEO helper functions for image optimization
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
