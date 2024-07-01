import PenseeBohemeCredentials from "~/api/pensee_boheme/PenseeBohemeCredentials";
import type { Product } from "~/types/models";

export const useIndexProductService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey;

  // console.log("filter", filter);
  const getProducts = () => {
    return useFetch<{ data: Product[] }>(`${apiKey}/products`);
  };

  return {
    getProducts,
  };
};
