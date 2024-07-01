import PenseeBohemeCredentials from "~/api/pensee_boheme/PenseeBohemeCredentials";
import type { Cart, User } from "~/types/models";

export const useAuthenticationService = () => {
  const { setAuthToken } = useAuthToken();
  const { getHeaders } = useHeaders();
  const { fetchCart, setCart } = useCartService();
  const { checkIfAuth } = useUserService();
  const apiKey = new PenseeBohemeCredentials().apiKey;

  const login = async (user: Pick<User, "email" | "password">) => {
    const loginResponse = await useFetch<{ token: string }>(
      `${apiKey}/auth/login`,
      {
        method: "POST",
        body: user,
      }
    );

    // If there is an error, log the error message
    if (loginResponse.error.value) {
      console.log("error message", loginResponse.error);
    }

    if (loginResponse.data.value) {
      setAuthToken(`Bearer ${loginResponse.data.value.token}`);
      await checkIfAuth();
    }

    const existingCartResponse = await fetchCart();

    if (
      existingCartResponse.data.value &&
      existingCartResponse.data.value.cart.products.data.length > 0
    ) {
      setCart(existingCartResponse.data.value.cart);
      return;
    }

    const cart = useState<Cart>("cart");

    if (!cart.value) {
      return;
    }

    const transferResponse = useFetch<{ cart: Cart }>(
      `${apiKey}/carts/${cart.value.id}/transfer`,
      {
        method: "PATCH",
        headers: getHeaders(),
      }
    );

    if (transferResponse.error.value) {
      console.log("error message", transferResponse.error);
    }

    if (transferResponse.data.value) {
      setCart(transferResponse.data.value.cart);
    }

    return;
  };

  const register = (
    user: Pick<User, "first_name" | "last_name" | "email" | "password">
  ) => {
    const response = useFetch(`${apiKey}/auth/register`, {
      method: "POST",
      body: user,
    });

    // If there is an error, log the error message
    if (response.error.value) {
      console.log("error message", response.error);
    }

    return response;
  };

  return { login, register };
};
