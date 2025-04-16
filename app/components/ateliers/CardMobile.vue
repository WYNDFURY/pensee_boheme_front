<template>
  <!-- mobile / tablet -->

  <div class="lg:hidden">
    <IconsBannerLogo class="w-12 my-8 mx-auto text-accent-500" />
    <p class="text-center text-3xl text-accent-500 uppercase leading-relaxed font-normal p-4">
      {{ product.name }}
    </p>
    <NuxtImg
      :src="product.media[0]?.url"
      :alt="product.name"
      class="object-cover w-full border-1 border-gray-700 rounded-sm drop-shadow-md opacity-80"
      loading="lazy"
    />
    <div class="my-8">
      <p
        v-for="(sentence, index) in formattedDescription"
        :key="index"
        class="w-3/4 mx-auto text-center text-lg md:text-xl font-light leading-relaxed"
      >
        {{ sentence }}
      </p>
    </div>

    <div class="h-px w-24 my-8 mx-auto rounded-full bg-accent-500"></div>
    <p class="text-center text-2xl font-medium text-accent-500">
      {{ product.price }} € par personne
    </p>
  </div>
</template>

<script lang="ts" setup>
  import type { Product } from '~/types/models'
  const props = defineProps<{
    product: Product
  }>()

  // Format the description text into sentences
  function formatDescription(text: string): string[] {
    if (!text) return []
    // Split by period, exclamation mark, or question mark followed by a space
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => sentence.trim() !== '')
      .map((sentence) => sentence.trim())
  }

  // Computed property with the formatted description
  const formattedDescription = formatDescription(props.product.description)
</script>
