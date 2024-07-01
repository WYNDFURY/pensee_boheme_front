export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

export type CartProduct = Product & {
  quantity: number;
};

export type Cart = {
  id: number;
  user_id: number;
  anonymous_id: string;
  products: {
    data: CartProduct[];
    total: number;
  };
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
