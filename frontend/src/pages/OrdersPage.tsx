import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { useAuthStore } from '../store/authStore'
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../lib/utils'
import { Skeleton } from '../components/ui/Skeleton'

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading } = useOrders()

  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-bold text-[#f0ece4] mb-8">Pesanan Saya</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1c1c28] flex items-center justify-center mb-4">
            <Package size={24} className="text-[#5a5550]" />
          </div>
          <p className="text-[#a09a8e] font-medium">Belum ada pesanan</p>
          <p className="text-sm text-[#5a5550] mt-1">Pesanan yang kamu buat akan muncul di sini</p>
          <Link to="/cards" className="text-sm text-[#e5b13a] hover:underline mt-4">
            Lihat koleksi kartu →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.data.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to={`/orders/${order.id}`}
                className="flex items-center gap-4 bg-[#16161f] border border-[#2a2a38] hover:border-[#e5b13a44] rounded-xl p-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1c1c28] flex items-center justify-center shrink-0">
                  <Package size={16} className="text-[#e5b13a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#f0ece4]">{order.order_number}</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        color: getStatusColor(order.status),
                        background: `${getStatusColor(order.status)}22`,
                      }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a5550] mt-0.5">
                    {order.items?.length ?? 0} item · {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#e5b13a]">{formatPrice(order.total_amount)}</p>
                  <ChevronRight size={14} className="text-[#5a5550] group-hover:text-[#a09a8e] transition-colors ml-auto mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
