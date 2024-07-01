<template>
  <div class="flex p-4 border-b border-gray-200 items-center space-x-4">
    <img :src="cartProduct?.image" alt="" class="w-20 h-20 object-cover">
    <div class="flex-grow">
      <div class="font-bold">{{ cartProduct?.name }}</div>
      <div class="text-gray-600">Price: €{{ cartProduct?.price }}</div>
      <div class="text-gray-600">
        Quantity: {{ cartProduct.quantity }}
      </div>
    </div>
    <div class="text-lg font-semibold">€{{ cartProduct.price * cartProduct.quantity }}</div>
    <button @click="removeFromCart(cartProduct)" class="text-[#204534]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { CartProduct } from '~/types/models';

const props = defineProps<{
  cartProduct: CartProduct;
}>();

const { removeFromCart } = useCartService();


</script>

<style></style>