import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Base URL is configurable for production (different origin / reverse proxy).
// Falls back to '/api', which the Vite dev server proxies to the backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Attach JWT on every request — token comes from the single auth store source.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      // Only the admin panel is authenticated; bounce expired sessions there.
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  },
)

export default api
