import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { Product } from '~/types/models'

export const useIndexProductService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey

  const getProducts = () => {
    return useFetch<Product[]>(`${apiKey}/products`)
  }

  return {
    getProducts,
  }
}
