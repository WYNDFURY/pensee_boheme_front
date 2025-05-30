<template>
  <div>
    <h1 class="text-3xl md:text-4xl lg:text-5xl text-center mt-8">
      {{ gallery.data.name }}
    </h1>
    <div class="columns-2 md:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4 p-4 md:p-8">
      <div
        v-for="galleryMedia in gallery.data.media"
        :key="galleryMedia.id"
        class="w-full rounded-xl shadow"
      >
        <NuxtImg
          class="h-auto max-w-full rounded-lg"
          :src="galleryMedia.url"
          :alt="galleryMedia.name"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Gallery } from '~/types/models'

  defineProps<{
    gallery: Gallery
  }>()
</script>
