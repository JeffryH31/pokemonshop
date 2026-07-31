import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { Card, Category, PaginatedResponse } from '../types'

export interface CardFilters {
  page?: number
  per_page?: number
  category?: Category | string
  min_price?: number | string
  max_price?: number | string
  sort?: string
}

export function useCards(filters: CardFilters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined && v !== null),
  )
  return useQuery<PaginatedResponse<Card>>({
    queryKey: ['cards', params],
    queryFn: () =>
      api.get('/catalog/cards', { params }).then((r) => {
        const payload = r.data?.data ?? r.data
        if (payload?.items && payload?.meta) {
          return {
            data: payload.items,
            current_page: payload.meta.current_page,
            last_page: payload.meta.last_page,
            per_page: payload.meta.per_page,
            total: payload.meta.total,
            from: 0,
            to: payload.items.length,
          } as PaginatedResponse<Card>
        }
        return payload
      }),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCard(id: number | string) {
  return useQuery<Card>({
    queryKey: ['card', id],
    queryFn: () => api.get(`/catalog/cards/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSearchCards(query: string) {
  return useQuery<Card[]>({
    queryKey: ['cards', 'search', query],
    queryFn: () =>
      api.get('/catalog/cards/search', { params: { q: query } }).then((r) => {
        const payload = r.data?.data ?? r.data
        if (payload?.items) return payload.items
        return payload
      }),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  })
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/catalog/categories').then((r) => r.data.data ?? r.data),
    staleTime: 60 * 60 * 1000,
  })
}
