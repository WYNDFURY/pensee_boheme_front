  <template>
    <div v-if="cartProducts">
      <CartsCard v-for="cartProduct in cartProducts" :key="cartProduct?.id" :cartProduct="cartProduct" />
      <div class="text-lg font-semibold text-right py-4">Total Price: {{ total }}</div>
      <button @click="checkout">checkout</button>
    </div>
  </template>

<script lang="ts" setup>
import type { CartProduct } from '~/types/models';

const props = defineProps<{
  cartProducts: CartProduct[],
  total: number
}>();

const checkout = async () => {
  const url = await useStripeCheckout(props.cartProducts);
  navigateTo(url, { external: true });
  console.log(url);
}

</script>

<style></style>
