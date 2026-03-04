import type { SitemapUrl } from '#sitemap/types'

type GalleryResponse = {
  slug: string
  name: string
  cover_image: string | null
  media?: { urls: { medium: string } }[]
}

export default defineEventHandler(async (): Promise<SitemapUrl[]> => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBaseUrl

  try {
    const galleries = await $fetch<GalleryResponse[]>(`${apiBase}/galleries`)
    return galleries
      .filter((g) => !!g.slug)
      .map((g) => {
        const images: { loc: string; title: string }[] = []

        if (g.cover_image) {
          images.push({ loc: g.cover_image, title: g.name })
        }

        if (g.media) {
          g.media.forEach((m) => {
            images.push({ loc: m.urls.medium, title: g.name })
          })
        }

        return {
          loc: `/galeries/${g.slug}`,
          changefreq: 'monthly' as const,
          priority: 0.8,
          images,
        }
      })
  } catch {
    return []
  }
})
