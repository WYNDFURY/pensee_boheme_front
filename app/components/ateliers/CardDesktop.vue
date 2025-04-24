<template>
  <div class="hidden lg:flex flex-col">
    <!-- even index -->
    <div v-show="isEven">
      <div class="relative grid grid-cols-2 mb-20">
        <div class="flex items-center justify-center">
          <div class="relative aspect-[2/3] w-[25vw] z-10">
            <NuxtImg
              :src="product.media[0]?.url"
              :alt="product.name"
              class="object-cover w-full h-full rounded-sm drop-shadow-md opacity-80"
              loading="lazy"
            />
          </div>
          <div
            class="bg-primary_orange absolute text-center inset-x-0 top-1/2 -translate-y-1/2 py-2"
          >
            <div class="w-1/2 ml-auto">
              <div class="pr-[10vw] text-balance text-slate-900 space-y-2">
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
        <p class="absolute w-1/2 text-center right-0 pr-[10vw] text-4xl text-accent-500">
          {{ product.name }}
        </p>
      </div>
    </div>

    <!-- odd index -->
    <div v-show="!isEven">
      <div class="relative grid grid-cols-2 mb-20">
        <div class="flex items-center justify-center col-start-2">
          <div class="relative aspect-[2/3] w-[25vw] z-10">
            <NuxtImg
              :src="product.media[0]?.url"
              :alt="product.name"
              placeholder=""
              class="object-cover w-full h-full rounded-sm drop-shadow-md opacity-80"
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
        <p class="absolute w-1/2 text-center pl-[10vw] text-4xl text-accent-500">
          {{ product.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Product } from '~/types/models'
  const props = defineProps<{
    product: Product
    isEven: boolean
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
