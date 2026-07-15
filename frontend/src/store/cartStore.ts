import { create } from 'zustand'
import type { Cart } from '../types'

interface CartState {
  cart: Cart | null
  isOpen: boolean
  setCart: (cart: Cart | null) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  itemCount: number
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isOpen: false,
  get itemCount() {
    return get().cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  },
  setCart: (cart) => set({ cart }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}))
