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

export type ApiResponse<T> = {
  data: T
}

export type Page = ApiResponse<PageData>
