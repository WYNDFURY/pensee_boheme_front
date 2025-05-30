<template>
  <div v-for="category in page.categories" :key="category.id" class="my-10">
    <!-- Container for alignment consistency -->
    <div class="w-full max-w-7xl mx-auto px-4 md:px-8 font-[Josefin_Slab]">
      <!-- Heading with same constraints as product grid -->
      <h2 class="text-3xl md:text-4xl mb-8 mt-16 mx-auto w-fit border-b-1">
        {{ category.name }}
      </h2>

      <div
        v-if="category.name === 'Détails Personnalisés'"
        class="flex flex-col text-center text-xl leading-relaxed text-pretty mb-8"
      >
        <p>
          Je crois fermement en l'importance de l'unique, c'est pourquoi chaque création est
          réalisée sur mesure et personnalisée pour votre occasion.
        </p>
        <p>
          Il est encouragé de remplir le
          <NuxtLink
            to="/infos-pratiques"
            class="relative border-b border-dotted border-accent-500 font-bold text-accent-500 group md:border-none"
            >formulaire de demande
            <span
              class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
            ></span>
          </NuxtLink>
          afin que nous puissions collaborer ensemble à la conception de votre pièce unique.
        </p>
      </div>

      <div
        v-if="category.name === 'Cadeaux invités'"
        class="flex flex-col text-center text-xl leading-relaxed text-pretty mb-8"
      >
        <p>À la recherche du cadeau d'invités parfait ?</p>
        <p>
          Pour un baptême, un anniversaire ou un mariage, un cadeau fleuri fera plaisir à vos
          invités et leur permettra de garder un souvenir impérissable de cette belle journée passée
          en votre compagnie !
        </p>
      </div>

      <!-- Product grid with same width constraints -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
        <ProductsCard v-for="product in category.products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PageData } from '~/types/models'

  defineProps<{
    page: PageData
  }>()
</script>

<style></style>
