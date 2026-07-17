import { useQuery } from '@tanstack/react-query'
import { TrendingUp, ShoppingBag, Package, DollarSign } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import { Skeleton } from '../../components/ui/Skeleton'

interface DashboardData {
  total_orders: number
  total_revenue: string
  total_cards: number
  orders_by_status: Record<string, number>
  recent_orders: any[]
}

const STATUS_ID: Record<string, string> = {
  pending_payment: 'Menunggu Bayar',
  paid: 'Sudah Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  cancelled: 'Dibatalkan',
  expired: 'Kedaluwarsa',
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data.data ?? r.data),
    staleTime: 60 * 1000,
  })

  const stats = [
    {
      label: 'Total Pesanan',
      value: data?.total_orders ?? 0,
      icon: <ShoppingBag size={18} className="text-[#e5b13a]" />,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Total Pendapatan',
      value: data?.total_revenue ?? '0',
      icon: <DollarSign size={18} className="text-green-400" />,
      format: (v: string | number) => formatPrice(v),
    },
    {
      label: 'Kartu Aktif',
      value: data?.total_cards ?? 0,
      icon: <Package size={18} className="text-[#60a5fa]" />,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Menunggu Bayar',
      value: data?.orders_by_status?.['pending_payment'] ?? 0,
      icon: <TrendingUp size={18} className="text-[#fbbf24]" />,
      format: (v: number) => v.toString(),
    },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#f0ece4] mb-6">Dasbor</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#5a5550] uppercase tracking-wide">{stat.label}</span>
              <div className="w-8 h-8 rounded-lg bg-[#1c1c28] flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-bold text-[#f0ece4] font-display">
                {stat.format(stat.value as any)}
              </p>
            )}
          </div>
        ))}
      </div>

      {data?.orders_by_status && (
        <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#f0ece4] mb-4">Pesanan Berdasarkan Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(data.orders_by_status).map(([status, count]) => (
              <div key={status} className="bg-[#1c1c28] rounded-lg p-3">
                <p className="text-xs text-[#5a5550]">{STATUS_ID[status] ?? status}</p>
                <p className="text-lg font-bold text-[#f0ece4] mt-0.5">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
