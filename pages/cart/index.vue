<template>
  <CartsList class="flex flex-col" v-if="cartState" :cartProducts="cartState.products.data"
    :total="cartState.products.total" />
</template>

<script lang="ts" setup>
import type { Cart } from '~/types/models';

const cartState = useState<Cart>("cart");


</script>

<style></style>