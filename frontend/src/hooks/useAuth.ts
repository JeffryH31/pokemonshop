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
      api.post('/auth/login', data).then((r) => (r.data.data ?? r.data) as AuthResponse),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(`Selamat datang kembali, ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    },
    onError: () => toast.error('Email atau password salah'),
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: { name: string; email: string; phone: string; password: string; password_confirmation: string }) =>
      api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
    onSuccess: () => {
      toast.success('Akun berhasil dibuat! Silakan masuk.')
      navigate('/login')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Pendaftaran gagal'
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
      toast.success('Berhasil keluar')
    },
  })
}

export function useMe() {
  const { isAuthenticated } = useAuthStore()
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then((r) => r.data.data ?? r.data),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const { user, token, setAuth } = useAuthStore()
  return useMutation({
    mutationFn: (data: { name?: string; email?: string; phone?: string; password?: string; password_confirmation?: string }) =>
      api.put('/auth/profile', data).then((r) => (r.data.data ?? r.data) as User),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['me'] })
      // Keep the persisted auth store in sync so the UI reflects changes immediately
      if (token) setAuth({ ...(user as User), ...updated }, token)
      toast.success('Profil diperbarui!')
    },
    onError: () => toast.error('Gagal memperbarui profil'),
  })
}
