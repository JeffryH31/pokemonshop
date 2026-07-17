import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import type { Order, PaginatedResponse } from '../../types'
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'

const STATUSES = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'expired']

const STATUS_ID: Record<string, string> = {
  pending_payment: 'Menunggu Bayar',
  paid: 'Sudah Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  cancelled: 'Dibatalkan',
  expired: 'Kedaluwarsa',
}

export default function AdminOrders() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery<PaginatedResponse<Order>>({
    queryKey: ['admin', 'orders', page, statusFilter],
    queryFn: () =>
      api.get('/admin/orders', { params: { page, per_page: 15, status: statusFilter || undefined } }).then((r) => r.data),
    staleTime: 30 * 1000,
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'orders'] }); toast.success('Status diperbarui') },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal memperbarui status'),
  })

  const { mutate: cancelOrder } = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/orders/${id}/cancel`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'orders'] }); toast.success('Pesanan dibatalkan') },
    onError: () => toast.error('Tidak dapat membatalkan pesanan ini'),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Pesanan</h1>
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          placeholder="Semua Status"
          options={STATUSES.map((s) => ({ value: s, label: STATUS_ID[s] ?? s }))}
          className="w-48"
        />
      </div>

      <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#2a2a38]">
            <tr>
              {['No. Pesanan', 'Pelanggan', 'Status', 'Total', 'Tanggal', 'Aksi'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#5a5550] uppercase tracking-wide font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2a]">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
                ))
              : data?.data.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1c1c28] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#e5b13a]">{order.order_number}</td>
                    <td className="px-4 py-3 text-[#f0ece4]">{order.recipient_name}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={order.status}
                        onChange={(e) => updateStatus({ id: order.id, status: e.target.value })}
                        options={STATUSES.map((s) => ({ value: s, label: STATUS_ID[s] ?? s }))}
                        className="!py-1 !px-2 text-xs w-40"
                        style={{ color: getStatusColor(order.status) } as any}
                      />
                    </td>
                    <td className="px-4 py-3 text-[#e5b13a] font-semibold">{formatPrice(order.total_amount)}</td>
                    <td className="px-4 py-3 text-[#5a5550] text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/orders/${order.id}`} target="_blank" className="p-1.5 rounded text-[#5a5550] hover:text-[#60a5fa] hover:bg-blue-500/10 transition-all">
                          <Eye size={13} />
                        </Link>
                        {(order.status === 'pending_payment' || order.status === 'paid') && (
                          <button
                            onClick={() => { if (confirm('Batalkan pesanan ini?')) cancelOrder(order.id) }}
                            className="text-xs text-red-400 hover:underline"
                          >
                            Batalkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {data && data.last_page > 1 && (
          <div className="px-4 py-3 border-t border-[#2a2a38] flex items-center justify-between">
            <span className="text-xs text-[#5a5550]">{data.from}–{data.to} dari {data.total}</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
              <Button variant="secondary" size="sm" disabled={page === data.last_page} onClick={() => setPage(page + 1)}>Berikutnya</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
