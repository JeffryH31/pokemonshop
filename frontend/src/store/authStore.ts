import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

// Single source of truth for the admin JWT. Persistence is handled entirely by
// the `persist` middleware (key `auth-storage`) — the API layer reads the token
// from here via `useAuthStore.getState()`, so there is no second copy to drift.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)

// Derived selectors — kept out of the store to stay reactive after rehydration
// (getters defined inside the initializer get flattened by persist's merge).
export const selectIsAuthenticated = (state: AuthState) => !!state.token
export const selectIsAdmin = (state: AuthState) => state.user?.role === 'admin'
