import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { GalleryData } from '~/types/models'

export const useGalleryService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey
  const { updateSlugFromRoute } = useCurrentSlugService()

  const getIndexOfGalleries = () => {
    const { data } = useFetch<GalleryData[]>(`${apiKey}/galleries`, {
      key: 'galleries-index',
    })

    return { data }
  }

  const getShowOfGallery = (slug: string) => {
    updateSlugFromRoute()

    const { data } = useFetch<GalleryData>(`${apiKey}/galleries/${slug}`, {
      key: `gallery-${slug}`,
    })

    return { data }
  }

  return {
    getIndexOfGalleries,
    getShowOfGallery,
  }
}
