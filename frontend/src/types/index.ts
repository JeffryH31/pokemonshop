export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export interface Set {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  cards_count?: number
}

export interface Card {
  id: number
  set_id: number
  name: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Rare Holo' | 'Ultra Rare' | 'Secret Rare'
  condition: 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Poor'
  price: string
  stock: number
  description: string | null
  image_url: string | null
  is_active: boolean
  is_available: boolean
  set?: Set
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

export interface CartItem {
  id: number
  card_id: number
  quantity: number
  subtotal: number
  card: Card
}

export interface Cart {
  id: number
  user_id: number
  total: number
  items: CartItem[]
}

export interface OrderItem {
  id: number
  card_id: number
  card_name: string
  unit_price: string
  quantity: number
  subtotal: string
  card?: Card
}

export interface Order {
  id: number
  order_number: string
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'expired'
  total_amount: string
  recipient_name: string
  street_address: string
  city: string
  postal_code: string
  tracking_number: string | null
  status_updated_at: string | null
  created_at: string
  items: OrderItem[]
}

export interface CheckoutPayload {
  recipient_name: string
  street_address: string
  city: string
  postal_code: string
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
