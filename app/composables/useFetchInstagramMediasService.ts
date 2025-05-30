import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'
import type { InstagramMedia } from '~/types/models'

export const useFetchInstagramMediasService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey

  const getInstagramMedias = () => {
    return useFetch<InstagramMedia[]>(`${apiKey}/instagram`, {
      server: false,
      lazy: true,
    })
  }

  return {
    getInstagramMedias,
  }
}
