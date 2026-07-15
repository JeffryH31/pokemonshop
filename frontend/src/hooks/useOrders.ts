import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import type { CheckoutPayload, Order, PaginatedResponse } from '../types'

export function useOrders() {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then((r) => r.data),
    staleTime: 60 * 1000,
  })
}

export function useOrder(id: number | string) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}

export function useCheckout() {
  const qc = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CheckoutPayload) =>
      api.post('/orders/checkout', data).then((r) => r.data.data ?? r.data),
    onSuccess: (order: Order) => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Checkout failed'
      toast.error(msg)
    },
  })
}
