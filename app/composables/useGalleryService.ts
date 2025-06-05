import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { Galleries, Gallery } from '~/types/models'

export const useGalleryService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey
  const { updateSlugFromRoute } = useCurrentSlugService()

  const getIndexOfGalleries = () => {
    const { data } = useFetch<Galleries>(`${apiKey}/galleries`, {
      key: 'galleries-index',
      server: false,
    })

    return { data }
  }

  const getShowOfGallery = (slug: string) => {
    updateSlugFromRoute()

    const { data } = useFetch<Gallery>(`${apiKey}/galleries/${slug}`, {
      key: `gallery-${slug}`,
      server: false,
    })

    return { data }
  }

  return {
    getIndexOfGalleries,
    getShowOfGallery,
  }
}
