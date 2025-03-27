<template>
  <div class="relative bg-bgcolor text-white">
    <NuxtImg
      :src="bannerImage"
      :alt="alt"
      class="w-full h-[20vh] md:h-[50vh] opacity-80 object-cover"
      :class="imgClass"
    />
    <div
      class="text-[3vh] md:text-[6vh] lg:text-[8vh] absolute inset-0 flex items-center justify-center font-light font-['Source_Serif_4'] uppercase italic leading-tight tracking-[0.5em] drop-shadow-sm"
      :class="textClass"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    // Image path to display in the banner
    bannerImage: {
      type: String,
      required: true,
    },
    // Alt text for accessibility
    alt: {
      type: String,
      default: 'Banner image',
    },
    textClass: {
      type: String,
      default: '',
    },
    imgClass: {
      type: String,
      default: '',
    },
  })
</script>
