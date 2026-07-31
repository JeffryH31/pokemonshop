import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

// Admin JWT store. Persisted via `persist` (key `auth-storage`); the API layer
// reads the token from here so there's a single source of truth.
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

// Selectors live outside the store to stay reactive after rehydration.
export const selectIsAuthenticated = (state: AuthState) => !!state.token
export const selectIsAdmin = (state: AuthState) => state.user?.role === 'admin'
