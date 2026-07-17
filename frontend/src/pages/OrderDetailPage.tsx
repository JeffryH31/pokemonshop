import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, MapPin, Truck } from 'lucide-react'
import { useOrder } from '../hooks/useOrders'
import { useAuthStore } from '../store/authStore'
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../lib/utils'
import { Skeleton } from '../components/ui/Skeleton'

const ORDER_STEPS = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered']

const STEP_LABELS: Record<string, string> = {
  pending_payment: 'Menunggu Bayar',
  paid: 'Sudah Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  cancelled: 'Dibatalkan',
  expired: 'Kedaluwarsa',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStore()
  const { data: order, isLoading } = useOrder(id!)

  if (!isAuthenticated) return <Navigate to="/login" />

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="text-[#a09a8e]">Pesanan tidak ditemukan</p>
        <Link to="/orders" className="text-sm text-[#e5b13a] mt-2 hover:underline">Kembali ke pesanan</Link>
      </div>
    )
  }

  const currentStep = ORDER_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled' || order.status === 'expired'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm text-[#5a5550] hover:text-[#a09a8e] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Kembali ke pesanan
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-5"
      >
        {/* Header */}
        <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-[#5a5550] uppercase tracking-wide">Nomor Pesanan</p>
              <p className="font-display text-lg font-bold text-[#f0ece4] mt-0.5">{order.order_number}</p>
              <p className="text-xs text-[#5a5550] mt-1">Dipesan pada {formatDate(order.created_at)}</p>
            </div>
            <div className="text-right">
              <span
                className="inline-block text-sm font-semibold px-3 py-1.5 rounded-full"
                style={{
                  color: getStatusColor(order.status),
                  background: `${getStatusColor(order.status)}22`,
                }}
              >
                {STEP_LABELS[order.status] ?? getStatusLabel(order.status)}
              </span>
              <p className="text-2xl font-bold text-[#e5b13a] mt-2">{formatPrice(order.total_amount)}</p>
            </div>
          </div>

          {/* Progress tracker */}
          {!isCancelled && (
            <div className="mt-6">
              <div className="flex items-center justify-between relative">
                {ORDER_STEPS.map((step, i) => {
                  const done = i <= currentStep
                  const active = i === currentStep
                  return (
                    <div key={step} className="flex flex-col items-center flex-1 relative">
                      {i > 0 && (
                        <div
                          className="absolute left-[-50%] right-[50%] h-0.5 top-3 -translate-y-1/2 z-0"
                          style={{ background: done ? '#e5b13a' : '#2a2a38', transition: 'background 0.3s' }}
                        />
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                          done ? 'bg-[#e5b13a] border-[#e5b13a]' : 'bg-[#16161f] border-[#2a2a38]'
                        } ${active ? 'ring-2 ring-[#e5b13a44]' : ''}`}
                      >
                        {done && <div className="w-2 h-2 rounded-full bg-[#0a0a0f]" />}
                      </div>
                      <span className="text-[9px] text-[#5a5550] mt-1.5 text-center leading-tight hidden sm:block">
                        {STEP_LABELS[step]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Info pengiriman */}
        <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={15} className="text-[#e5b13a]" />
            <h2 className="text-sm font-semibold text-[#f0ece4]">Info Pengiriman</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#5a5550] mb-0.5">Penerima</p>
              <p className="text-[#f0ece4]">{order.recipient_name}</p>
            </div>
            <div>
              <p className="text-xs text-[#5a5550] mb-0.5">Kota</p>
              <p className="text-[#f0ece4]">{order.city}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-[#5a5550] mb-0.5">Alamat</p>
              <p className="text-[#f0ece4]">{order.street_address}, {order.postal_code}</p>
            </div>
            {order.tracking_number && (
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Truck size={12} className="text-[#e5b13a]" />
                  <p className="text-xs text-[#5a5550]">Nomor Resi</p>
                </div>
                <p className="text-[#e5b13a] font-mono text-sm">{order.tracking_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Item pesanan */}
        <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={15} className="text-[#e5b13a]" />
            <h2 className="text-sm font-semibold text-[#f0ece4]">Item Pesanan ({order.items.length})</h2>
          </div>

          <ul className="divide-y divide-[#1e1e2a]">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3">
                {item.card?.image_url ? (
                  <img
                    src={item.card.image_url}
                    alt={item.card_name}
                    className="w-12 h-14 object-cover rounded-lg border border-[#2a2a38]"
                  />
                ) : (
                  <div className="w-12 h-14 bg-[#1c1c28] rounded-lg border border-[#2a2a38] flex items-center justify-center text-[#5a5550] text-xs">
                    P
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f0ece4] truncate">{item.card_name}</p>
                  <p className="text-xs text-[#5a5550] mt-0.5">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#e5b13a] shrink-0">{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[#2a2a38] pt-3 mt-1 flex justify-between">
            <span className="text-sm text-[#5a5550]">Total</span>
            <span className="text-base font-bold text-[#e5b13a]">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
