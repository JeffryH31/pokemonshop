import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card } from '../types'

interface FavouritesState {
  items: Card[]
  toggle: (card: Card) => void
  add: (card: Card) => void
  remove: (cardId: number) => void
  clear: () => void
  isFavourite: (cardId: number) => boolean
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      items: [],

      isFavourite: (cardId) => get().items.some((card) => card.id === cardId),

      add: (card) =>
        set((state) =>
          state.items.some((c) => c.id === card.id)
            ? state
            : { items: [card, ...state.items] },
        ),

      remove: (cardId) =>
        set((state) => ({ items: state.items.filter((card) => card.id !== cardId) })),

      toggle: (card) =>
        set((state) =>
          state.items.some((c) => c.id === card.id)
            ? { items: state.items.filter((c) => c.id !== card.id) }
            : { items: [card, ...state.items] },
        ),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'favourites-storage',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

// ── Derived selector (reactive) ──────────────────────────────────────────────
export const useFavouritesCount = () => useFavouritesStore((s) => s.items.length)
