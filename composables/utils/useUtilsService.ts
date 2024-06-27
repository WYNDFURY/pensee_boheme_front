export const useUtilsService = () => {
  const addToCart = (product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  }) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productInCart = cart.find(
      (p: {
        id: number;
        name: string;
        description: string;
        price: number;
        image: string;
      }) => p.id === product.id
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("cart", cart);
  };

  return { addToCart };
};
