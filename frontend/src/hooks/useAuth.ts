import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import type { AuthResponse, User } from '../types'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    },
    onError: () => toast.error('Invalid email or password'),
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
      api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success('Account created successfully!')
      navigate('/')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Registration failed'
      toast.error(msg)
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const { setCart } = useCartStore()
  const qc = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSettled: () => {
      logout()
      setCart(null)
      qc.clear()
      navigate('/')
      toast.success('Logged out successfully')
    },
  })
}

export function useMe() {
  const { isAuthenticated } = useAuthStore()
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then((r) => r.data.user ?? r.data),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name?: string; email?: string; password?: string; password_confirmation?: string }) =>
      api.put('/auth/profile', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profile updated!')
    },
    onError: () => toast.error('Failed to update profile'),
  })
}
