import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { Page } from '~/types/models'

export const useShowPageProductsService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey
  const { updateSlugFromRoute } = useCurrentSlugService()

  const getPageProducts = () => {
    updateSlugFromRoute()
    const slug = useState<string>('current-page-slug').value

    // Make the API call
    return useFetch<Page>(`${apiKey}/pages/${slug}`, {
      key: `page-${slug}`, // Add a unique key for caching
      server: false, // Run this on client side
      lazy: true, // Don't block page transition for this fetch
    })
  }

  return {
    getPageProducts,
  }
}
