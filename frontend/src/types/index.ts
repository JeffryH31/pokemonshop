export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export type Category =
  | 'Sealed Product Pokemon'
  | 'Sealed Product OnePiece'
  | 'Slab OnePiece'
  | 'Slab Pokemon'
  | 'Raw Card'
  | 'Accessoris'

export interface Card {
  id: number
  name: string
  category: Category
  price: string
  stock: number
  description: string | null
  image_url: string | null
  is_active: boolean
  is_available: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface AuthResponse {
  token: string
  token_type: string
  expires_in: number
  user: User
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Payload sent to the admin create/update card endpoints (via FormData).
export interface CardFormData {
  name: string
  category: string
  price: number
  stock: number
  description: string
  image?: File
}
