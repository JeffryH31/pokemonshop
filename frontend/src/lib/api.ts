import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Configurable base URL; falls back to '/api' (proxied by Vite in dev).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Attach JWT from the auth store on every request.
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
      // Redirect expired admin sessions to login.
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  },
)

export default api
