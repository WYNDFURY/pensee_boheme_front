import type { Media } from '~/types/models'

export type ImageContext = 'thumb' | 'card' | 'detail' | 'hero'

export interface ResponsiveImageConfig {
  src: string
  srcset: string
  sizes: string
  loading: 'lazy' | 'eager'
  format?: 'webp'
  quality?: number
}

export const useResponsiveImage = (
  media: Media | undefined,
  context: ImageContext,
  options?: {
    eager?: boolean
    customSizes?: string
    format?: 'webp'
    quality?: number
  }
): ResponsiveImageConfig => {
  // Fallback for missing media
  if (!media) {
    return {
      src: '/images/placeholder.jpg',
      srcset: '',
      sizes: '100vw',
      loading: 'lazy',
    }
  }

  // Backward compatibility: old format with url field
  if (!media.urls && media.url) {
    console.warn('[useResponsiveImage] Legacy media format detected', { media })
    return {
      src: media.url,
      srcset: '',
      sizes: '100vw',
      loading: options?.eager ? 'eager' : 'lazy',
      format: options?.format,
      quality: options?.quality,
    }
  }

  // New format with urls object
  if (!media.urls) {
    console.error('[useResponsiveImage] Missing urls object', { media })
    return {
      src: '/images/placeholder.jpg',
      srcset: '',
      sizes: '100vw',
      loading: 'lazy',
    }
  }

  const { urls } = media

  // Variant selection by context
  const variantMap: Record<ImageContext, string> = {
    thumb: urls.thumb,
    card: urls.medium,
    detail: urls.large,
    hero: urls.large,
  }

  // Srcset: 1x base variant, 2x higher resolution
  const srcsetMap: Record<ImageContext, string> = {
    thumb: `${urls.thumb} 1x, ${urls.medium} 2x`,
    card: `${urls.medium} 1x, ${urls.large} 2x`,
    detail: `${urls.large} 1x`,
    hero: `${urls.large} 1x`,
  }

  // Sizes attribute (responsive)
  const sizesMap: Record<ImageContext, string> = {
    thumb: '200px',
    card: '(min-width: 768px) 25vw, 50vw',
    detail: '(min-width: 768px) 75vw, 100vw',
    hero: '100vw',
  }

  return {
    src: variantMap[context],
    srcset: srcsetMap[context],
    sizes: options?.customSizes || sizesMap[context],
    loading: options?.eager ? 'eager' : 'lazy',
    format: options?.format || 'webp',
    quality: options?.quality || 80,
  }
}
