<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img :src="product.image" alt="Product Image" class="w-full h-48 object-cover">
    <div class="p-4">
      <h3 class="text-xl font-semibold text-[#204534]">{{ product.name }}</h3>
      <p class="text-gray-600 mt-2">{{ product.description }}</p>
      <div class="flex items-center justify-between mt-4">
        <span class="text-lg font-bold text-[#204534]">{{ product.price }}€</span>
        <button @click="updateCart(product)"
          class="bg-[#204534] text-[#fafafa] py-2 px-4 rounded-lg hover:bg-[#176333] transition-colors duration-300">Ajouter
          au panier</button>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { useCartService } from '~/composables/useCartService';
import type { Product } from '~/types/models';


const props = defineProps<{
  product: Product;
}>();

const { updateCart } = useCartService();


</script>

<style></style>