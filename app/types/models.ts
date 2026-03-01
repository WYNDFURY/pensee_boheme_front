export type PageData = {
  id: number
  slug: string
  categories?: Category[] | []
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  order: number
  page_slug: string | null
  products?: Product[] | []
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number | null
  price_formatted: string | null
  is_active: boolean
  has_price: boolean
  category_name: string | null
  media: Media[] | []
  options?: ProductOption[] | []
}

export type Media = {
  id: number
  name: string
  file_name: string
  mime_type: string
  size: number
  urls: {
    thumb: string      // 400x400 center-crop WebP
    medium: string     // 1200px max-width WebP
    large: string      // 2000px max-width WebP
    original: string   // Original uploaded file
  }
}

export type ProductOption = {
  id: number
  name: string
  price: number | null
  price_formatted: string | null
}

export type InstagramMedia = {
  id: number
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
}

export type GalleryData = {
  id: number
  name: string
  photographer: string | null
  slug: string
  description: string | null
  is_published: boolean
  cover_image: string | null
  order: number
  media?: Media[] | []
  images_count?: number
}

// Admin auth types
export type AuthUser = {
  id: number
  first_name: string
  last_name: string
  email: string
}

export type LoginResponse = {
  token: string
  user: AuthUser
}

export type MutationResponse<T = unknown> = {
  message: string
  data: T
}

export type ApiError = {
  message: string
  errors?: Record<string, string[]>
}
