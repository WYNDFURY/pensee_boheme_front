import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { Galleries, Gallery } from '~/types/models'

export const useGalleryService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey
  const { updateSlugFromRoute } = useCurrentSlugService()

  const getIndexOfGalleries = () => {
    return useLazyFetch<Galleries>(`${apiKey}/galleries`, {
      key: 'galleries-index',
      server: false,
    })
  }

  const getShowOfGallery = (slug: string) => {
    updateSlugFromRoute()

    return useFetch<Gallery>(`${apiKey}/galleries/${slug}`, {
      key: `gallery-${slug}`,
      server: false,
      lazy: true,
    })
  }

  return {
    getIndexOfGalleries,
    getShowOfGallery,
  }
}
