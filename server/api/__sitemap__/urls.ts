import type { SitemapUrl } from '#sitemap/types'

type GalleryResponse = {
  slug: string
  name: string
  cover_image: string | null
}

export default defineEventHandler(async (): Promise<SitemapUrl[]> => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBaseUrl

  try {
    const galleries = await $fetch<GalleryResponse[]>(`${apiBase}/galleries`)
    return galleries
      .filter((g) => !!g.slug)
      .map((g) => ({
        loc: `/galeries/${g.slug}`,
        changefreq: 'monthly' as const,
        priority: 0.8,
        images: g.cover_image ? [{ loc: g.cover_image, title: g.name }] : [],
      }))
  } catch {
    return []
  }
})
