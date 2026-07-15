import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { Card, PaginatedResponse, Set } from '../types'

export interface CardFilters {
  page?: number
  per_page?: number
  set_id?: number | string
  rarity?: string
  condition?: string
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
    queryFn: () => api.get('/catalog/cards', { params }).then((r) => r.data),
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
    queryFn: () => api.get('/catalog/cards/search', { params: { q: query } }).then((r) => r.data.data ?? r.data),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  })
}

export function useSets() {
  return useQuery<Set[]>({
    queryKey: ['sets'],
    queryFn: () => api.get('/catalog/sets').then((r) => r.data.data ?? r.data),
    staleTime: 10 * 60 * 1000,
  })
}

export function useRarities() {
  return useQuery<string[]>({
    queryKey: ['rarities'],
    queryFn: () => api.get('/catalog/rarities').then((r) => r.data.data ?? r.data),
    staleTime: 60 * 60 * 1000,
  })
}
