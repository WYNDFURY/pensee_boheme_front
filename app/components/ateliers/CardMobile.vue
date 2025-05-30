<template>
  <!-- mobile / tablet -->

  <div class="lg:hidden mt-16">
    <IconsBannerLogo class="w-12 mx-auto text-accent-500" />
    <p class="text-center text-3xl text-accent-500 uppercase leading-relaxed font-normal p-4">
      {{ product.name }}
    </p>
    <NuxtImg
      :src="product.media[0]?.url"
      :alt="product.name"
      placeholder=""
      class="object-cover w-full rounded-sm drop-shadow-md opacity-80"
      loading="lazy"
    />
    <div class="my-4">
      <p
        v-for="(sentence, index) in formattedDescription"
        :key="index"
        class="w-3/4 mx-auto text-center text-xl md:text-2xl font-light leading-relaxed text-pretty"
      >
        {{ sentence }}
      </p>
    </div>

    <div class="h-px w-24 mb-4 mx-auto rounded-full bg-accent-500"></div>
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
