import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import type { AuthResponse } from '../types'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post('/auth/login', data).then((r) => (r.data.data ?? r.data) as AuthResponse),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(`Selamat datang, ${data.user.name}!`)
      navigate('/admin')
    },
    onError: (err: AxiosError) => {
      // Separate bad credentials from server/network errors.
      if (err.response?.status === 401 || err.response?.status === 422) {
        toast.error('Email atau password salah')
      } else if (err.response) {
        toast.error('Terjadi kesalahan pada server. Coba lagi nanti.')
      } else {
        toast.error('Tidak dapat terhubung ke server. Periksa koneksimu.')
      }
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const qc = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSettled: () => {
      logout()
      qc.clear()
      navigate('/admin/login')
      toast.success('Berhasil keluar')
    },
  })
}
