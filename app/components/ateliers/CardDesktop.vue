<template>
  <div class="hidden lg:flex flex-col gap-20">
    <!-- even index -->
    <div class="relative grid grid-cols-2">
      <div class="flex items-center justify-center">
        <div class="relative aspect-[2/3] w-[25vw] z-10">
          <NuxtImg
            :src="product.media[0]?.url"
            :alt="product.name"
            class="object-cover w-full h-full border-1 border-gray-700 rounded-sm drop-shadow-md opacity-80"
            loading="lazy"
          />
        </div>
        <div class="bg-primary_orange absolute text-center inset-x-0 top-1/2 -translate-y-1/2 py-2">
          <div class="w-1/2 ml-auto">
            <div class="pr-[10vw] text-pretty text-slate-900 space-y-2">
              <p class="font-light text-xl lg:text-2xl">{{ product.price }} € par personne</p>
              <div>
                <p
                  v-for="(sentence, index) in formattedDescription"
                  :key="index"
                  class="mb-1 text-xl font-light leading-relaxed"
                >
                  {{ sentence }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="absolute right-0 pr-[25vw] text-4xl text-accent-500">{{ product.name }}</p>
    </div>

    <!-- odd index -->
    <div class="relative grid grid-cols-2">
      <div class="flex items-center justify-center col-start-2">
        <div class="relative aspect-[2/3] w-[25vw] z-10">
          <NuxtImg
            :src="product.media[0]?.url"
            :alt="product.name"
            class="object-cover w-full h-full border-1 border-gray-700 rounded-sm drop-shadow-md opacity-80"
            loading="lazy"
          />
        </div>
      </div>

      <div
        class="bg-primary_orange absolute text-center text-pretty inset-x-0 top-1/2 -translate-y-1/2 py-2"
      >
        <div class="w-1/2 mr-auto">
          <div class="pl-[10vw] text-slate-900 space-y-2">
            <p class="font-light text-xl lg:text-2xl">{{ product.price }} € par personne</p>
            <div>
              <p
                v-for="(sentence, index) in formattedDescription"
                :key="index"
                class="mb-1 text-xl font-light leading-relaxed"
              >
                {{ sentence }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p class="absolute pl-[25vw] text-4xl text-accent-500">{{ product.name }}</p>
    </div>
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

<style></style>
