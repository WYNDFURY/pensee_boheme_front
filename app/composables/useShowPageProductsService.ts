import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { PageData } from '~/types/models'

export const useShowPageProductsService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey
  const { updateSlugFromRoute } = useCurrentSlugService()

  const getPageProducts = () => {
    updateSlugFromRoute()

    const slug = useState<string>('current-page-slug').value

    return useFetch<PageData>(`${apiKey}/pages/${slug}`, {
      key: `page-${slug}`,
      server: false,
      lazy: true,
    })
  }

  return {
    getPageProducts,
  }
}
