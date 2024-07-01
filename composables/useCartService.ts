import PenseeBohemeCredentials from "~/api/pensee_boheme/PenseeBohemeCredentials";
import type { Cart, Product } from "~/types/models";
import { useHeaders } from "./useHeaders";

export const useCartService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey;
  const { getHeaders } = useHeaders();
  const cartState = useState<Cart>("cart");

  // fetch the cart if the user is authenticated or if a anonymous id is set
  const fetchCart = async () => {
    // Get the auth headers
    // If user, check if there is a cart for the user
    const response = await useFetch<{ cart: Cart }>(`${apiKey}/me/cart`, {
      headers: getHeaders(),
    });

    // If there is an error, log the error message
    if (response.error.value) {
      console.log("error message", response.error);
      return response;
    }

    return response;
  };

  // Add or update a product to the cart
  const updateCart = async (product: Product, quantity: number = 1) => {
    // Initialize the product quantity
    let productQuantity = 0;

    // check if the product is in the cart

    const productInCart =
      cartState.value.products.data.find((p) => p.id === product.id) || null;

    // If the product is in the cart, increment the quantity else set the quantity to 1
    if (productInCart) {
      productQuantity = productInCart.quantity += quantity;
    } else {
      productQuantity = quantity;
    }

    // Update the cart
    const response = await useFetch<{ data: Cart }>(
      `${apiKey}/carts/${cartState.value.id}/products/${product.id}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: { quantity: productQuantity },
      }
    );

    // If there is an error, log the error message
    if (response.error.value) {
      console.log("error message", response.error);
      return;
    }

    if (response.data.value) {
      setCart(response.data.value.data);
    }
  };

  // Remove a product to the cart
  const removeFromCart = async (product: Product) => {
    // Update the cart
    const response = await useFetch<{ data: Cart }>(
      `${apiKey}/carts/${cartState.value.id}/products/${product.id}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    // If there is an error, log the error message
    if (response.error.value) {
      console.log("error message", response.error);
      return;
    }

    if (response.data.value) {
      setCart(response.data.value.data);
    }
  };

  const emptyCart = async () => {
    // Update the cart
    const response = await useFetch<{ data: Cart }>(
      `${apiKey}/carts/${cartState.value.id}/empty`,
      {
        method: "PATCH",
        headers: getHeaders(),
      }
    );

    // If there is an error, log the error message
    if (response.error.value) {
      console.log("error message", response.error);
      return;
    }

    if (response.data.value) {
      setCart(response.data.value.data);
    }
  };

  const setCart = (cart: Cart) => {
    // Set the cart state
    cartState.value = cart;
  };

  const fetchAndSetCart = async () => {
    const response = await fetchCart();

    if (response.data.value) {
      setCart(response.data.value.cart);
    }
  };

  return {
    fetchCart,
    updateCart,
    removeFromCart,
    setCart,
    fetchAndSetCart,
    emptyCart,
  };
};
