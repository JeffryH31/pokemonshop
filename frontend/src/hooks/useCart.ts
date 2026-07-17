import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import type { Cart } from '../types'

export function useCart() {
  const { isAuthenticated } = useAuthStore()
  const { setCart } = useCartStore()

  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: () =>
      api.get('/cart').then((r) => {
        const cart = r.data.data ?? r.data
        setCart(cart)
        return cart
      }),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  const { openCart } = useCartStore()

  return useMutation({
    mutationFn: (data: { card_id: number; quantity: number }) =>
      api.post('/cart/items', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      openCart()
      toast.success('Ditambahkan ke keranjang!')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal menambahkan ke keranjang'
      toast.error(msg)
    },
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, quantity }: { cardId: number; quantity: number }) =>
      api.put(`/cart/items/${cardId}`, { quantity }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
    onError: () => toast.error('Gagal mengubah jumlah'),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (cardId: number) =>
      api.delete(`/cart/items/${cardId}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Item dihapus')
    },
    onError: () => toast.error('Gagal menghapus item'),
  })
}
