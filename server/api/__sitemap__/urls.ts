import type { SitemapUrl } from '#sitemap/types'

export default defineEventHandler(async (): Promise<SitemapUrl[]> => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBaseUrl

  try {
    const galleries = await $fetch<{ slug: string }[]>(`${apiBase}/galleries`)
    return galleries
      .filter((g) => !!g.slug)
      .map((g) => ({
        loc: `/galeries/${g.slug}`,
        changefreq: 'monthly' as const,
        priority: 0.8,
      }))
  } catch {
    return []
  }
})
