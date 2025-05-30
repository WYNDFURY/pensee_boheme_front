<template>
  <div>
    <a
      :href="instagramMedia.permalink"
      target="_blank"
      rel="noopener noreferrer"
      class="block relative aspect-square overflow-hidden rounded-md drop-shadow-md"
    >
      <NuxtImg
        :src="instagramMedia.media_url"
        :alt="instagramMedia.caption"
        class="object-cover w-full h-full rounded-md drop-shadow-md opacity-80 scale-95 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
        loading="lazy"
      />
    </a>
  </div>
</template>

<script lang="ts" setup>
  import type { InstagramMedia } from '~/types/models'

  defineProps<{
    instagramMedia: InstagramMedia
  }>()
</script>

<style></style>
