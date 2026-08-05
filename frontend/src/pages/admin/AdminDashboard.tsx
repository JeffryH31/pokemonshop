import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, Layers, AlertTriangle, XCircle, Wallet } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import { Skeleton } from '../../components/ui/Skeleton'

interface LowStockItem {
  id: number
  name: string
  category: string
  stock: number
  price: string
}

interface DashboardData {
  total_active_cards: number
  total_stock: number
  out_of_stock_count: number
  low_stock_count: number
  inventory_value: number
  low_stock_items: LowStockItem[]
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data.data ?? r.data),
    staleTime: 60 * 1000,
  })

  const stats: { label: string; value: number; icon: ReactNode; format: (v: number) => string }[] = [
    {
      label: 'Kartu Aktif',
      value: data?.total_active_cards ?? 0,
      icon: <Package size={18} className="text-[#e5b13a]" />,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Total Stok',
      value: data?.total_stock ?? 0,
      icon: <Layers size={18} className="text-[#60a5fa]" />,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Nilai Inventaris',
      value: data?.inventory_value ?? 0,
      icon: <Wallet size={18} className="text-green-400" />,
      format: (v: number) => formatPrice(v),
    },
    {
      label: 'Stok Menipis',
      value: data?.low_stock_count ?? 0,
      icon: <AlertTriangle size={18} className="text-[#fbbf24]" />,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Stok Habis',
      value: data?.out_of_stock_count ?? 0,
      icon: <XCircle size={18} className="text-red-400" />,
      format: (v: number) => v.toString(),
    },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#f0ece4] mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
                {stat.format(stat.value)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#f0ece4]">Perlu Restock</h2>
          <Link to="/admin/cards" className="text-xs text-[#e5b13a] hover:text-[#f0c547] transition-colors">
            Kelola Produk →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : !data?.low_stock_items?.length ? (
          <p className="text-sm text-[#5a5550] py-6 text-center">Semua stok dalam kondisi aman 🎉</p>
        ) : (
          <ul className="divide-y divide-[#1e1e2a]">
            {data.low_stock_items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="text-sm text-[#f0ece4] truncate">{item.name}</p>
                  <p className="text-xs text-[#5a5550]">{item.category}</p>
                </div>
                <span
                  className={`text-sm font-semibold shrink-0 ml-3 ${
                    item.stock === 0 ? 'text-red-400' : 'text-[#fbbf24]'
                  }`}
                >
                  {item.stock === 0 ? 'Habis' : `${item.stock} tersisa`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
