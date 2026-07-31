import { keepPreviousData, useQuery } from '@tanstack/react-query'
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

// The API may return either a Laravel-style paginator or an { items, meta }
// envelope. Normalise both shapes into PaginatedResponse in one place so the
// callers (catalog + admin) don't each reimplement it.
export function normalizePaginated<T>(payload: any): PaginatedResponse<T> {
  if (payload?.items && payload?.meta) {
    const { current_page, last_page, per_page, total } = payload.meta
    return {
      data: payload.items,
      current_page,
      last_page,
      per_page,
      total,
      from: total === 0 ? 0 : (current_page - 1) * per_page + 1,
      to: Math.min(current_page * per_page, total),
    }
  }
  return payload as PaginatedResponse<T>
}

export function useCards(filters: CardFilters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined && v !== null),
  )
  return useQuery<PaginatedResponse<Card>>({
    queryKey: ['cards', params],
    queryFn: () =>
      api
        .get('/catalog/cards', { params })
        .then((r) => normalizePaginated<Card>(r.data?.data ?? r.data)),
    staleTime: 2 * 60 * 1000,
    // Keep the current page visible while the next page loads (no skeleton flash).
    placeholderData: keepPreviousData,
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
