export type PageData = {
  id: number
  slug: string
  categories?: Category[] | []
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  order: number
  page_id: number
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
  category_id: number
  media: Media[] | []
  options?: ProductOption[] | []
}

export type Media = {
  id: number
  name: string
  url: string
}

export type ProductOption = {
  id: number
  name: string
  price: number | null
  price_formatted: string | null
}

export type InstagramMedia = {
  id: number
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM'
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
  cover_image: Media[] | null
  order: number
  media?: Media[] | []
}

export type ApiResponse<T> = {
  data: T
}

export type Gallery = ApiResponse<GalleryData>
export type Galleries = ApiResponse<GalleryData[]>

export type Page = ApiResponse<PageData>

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

export type ApiError = {
  message: string
  errors?: Record<string, string[]>
}
