import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      get isAuthenticated() {
        return !!get().token
      },
      get isAdmin() {
        return get().user?.role === 'admin'
      },
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
