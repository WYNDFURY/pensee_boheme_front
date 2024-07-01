import Stripe from "stripe";
import type { CartProduct } from "~/types/models";

export const useStripeCheckout = async (
  products: CartProduct[]
): Promise<string | null> => {
  const getFullPath = (param: { name: string }) => {
    const baseUrl = useRuntimeConfig().public.baseUrl;
    const fullPath = useRouter().resolve(param).fullPath;
    return `${baseUrl}${fullPath}`;
  };

  const success = getFullPath({ name: "checkout-success" });
  const failed = getFullPath({ name: "checkout-failed" });

  console.log(success, failed);
  const {
    public: { stripeApiKey },
  } = useRuntimeConfig();
  const stripe = new Stripe(stripeApiKey);
  const session = await stripe.checkout.sessions.create({
    line_items: products.map((product) => ({
      price_data: {
        currency: "EUR",
        unit_amount_decimal: (product.price * 100).toFixed(),
        product_data: {
          images: [product.image],
          name: product.name,
          tax_code: "txcd_20030000",
        },
      },
      quantity: product.quantity,
    })),
    success_url: success, // TODO redirect to correct frontend page and empty cart in setup script
    cancel_url: failed, // TODO redirect to correct frontend page
    mode: "payment",
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "CH"],
    },
  });

  return session.url;
};
