import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card } from '../types'

export interface CartLine {
  card: Card
  quantity: number
}

interface CartState {
  items: CartLine[]
  isOpen: boolean
  addItem: (card: Card, quantity?: number) => void
  updateQuantity: (cardId: number, quantity: number) => void
  removeItem: (cardId: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const clampToStock = (quantity: number, stock: number) =>
  Math.max(1, Math.min(quantity, Math.max(stock, 1)))

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (card, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((line) => line.card.id === card.id)
          if (existing) {
            return {
              items: state.items.map((line) =>
                line.card.id === card.id
                  ? { ...line, quantity: clampToStock(line.quantity + quantity, card.stock) }
                  : line,
              ),
            }
          }
          return {
            items: [...state.items, { card, quantity: clampToStock(quantity, card.stock) }],
          }
        }),

      updateQuantity: (cardId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((line) => line.card.id !== cardId)
              : state.items.map((line) =>
                  line.card.id === cardId
                    ? { ...line, quantity: clampToStock(quantity, line.card.stock) }
                    : line,
                ),
        })),

      removeItem: (cardId) =>
        set((state) => ({ items: state.items.filter((line) => line.card.id !== cardId) })),

      clear: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

// ── Derived selectors (reactive, always recomputed from `items`) ─────────────
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, line) => sum + line.quantity, 0))

export const useCartTotal = () =>
  useCartStore((s) =>
    s.items.reduce((sum, line) => sum + parseFloat(line.card.price) * line.quantity, 0),
  )
