import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { Gallery } from '~/types/models'

export const useGalleryService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey
  const { updateSlugFromRoute } = useCurrentSlugService()

  const getIndexOfGalleries = () => {
    return useFetch<Gallery[]>(`${apiKey}/galleries`, {
      server: false,
      lazy: true,
    })
  }

  const getShowOfGallery = () => {
    updateSlugFromRoute()
    const slug = useState<string>('current-page-slug').value

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
