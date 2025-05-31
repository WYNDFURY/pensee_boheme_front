import type { Galleries, GalleryData, Media } from '~/types/models'

export const useImageCache = () => {
  const cache = reactive(new Set<string>())
  const loading = reactive(new Set<string>())

  const preloadImage = (url: string): Promise<void> => {
    if (cache.has(url) || loading.has(url)) return Promise.resolve()

    loading.add(url)

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        cache.add(url)
        loading.delete(url)
        resolve()
      }
      img.onerror = () => {
        loading.delete(url)
        resolve()
      }
      img.src = url
    })
  }

  const preloadAllGalleries = async (galleries: Galleries) => {
    const allUrls: string[] = []

    galleries.data.forEach((gallery: GalleryData) => {
      if (gallery.media) {
        gallery.media.forEach((media: Media) => allUrls.push(media.url))
      }
    })

    // Preload in small batches
    for (let i = 0; i < allUrls.length; i += 4) {
      const batch = allUrls.slice(i, i + 4)
      await Promise.allSettled(batch.map(preloadImage))

      // Small delay to not overwhelm browser
      if (i + 4 < allUrls.length) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }
  }

  return {
    preloadImage,
    preloadAllGalleries,
    isLoaded: (url: string) => cache.has(url),
    cacheSize: computed(() => cache.size),
  }
}
