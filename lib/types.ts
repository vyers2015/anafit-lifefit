export type Category = 'legging' | 'top' | 'conjunto' | 'macacão' | 'shorts' | 'calça' | 'jaqueta' | 'todos'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  category: string
  sizes: string[]
  colors: string[]
  image_url: string
  images?: string[]
  is_featured: boolean
  is_new: boolean
  is_promotion: boolean
  discount_percent?: number
  created_at: string
  stock: number
}

export interface CarouselSlide {
  id: string
  title: string
  subtitle: string
  cta_text: string
  cta_link: string
  image_url: string
  badge?: string
  active: boolean
  order_index: number
}

export interface FilterState {
  category: string
  sizes: string[]
  colors: string[]
  minPrice: number
  maxPrice: number
  sortBy: string
}
