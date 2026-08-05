import { useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import api from '../../lib/api'
import { useCategories, normalizePaginated } from '../../hooks/useCatalog'
import type { ApiError, Card, CardPayload, PaginatedResponse } from '../../types'
import { formatPrice } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'
import ProductImage from '../../components/ui/ProductImage'

const EMPTY_FORM = {
  name: '', category: 'Raw Card',
  price: '', stock: '', description: '', image_url: '',
}

export default function AdminCards() {
  const qc = useQueryClient()
  const { data: categories } = useCategories()
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Card | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data, isLoading } = useQuery<PaginatedResponse<Card>>({
    queryKey: ['admin', 'cards', page],
    queryFn: () =>
      api
        .get('/catalog/cards', { params: { page, per_page: 15 } })
        .then((r) => normalizePaginated<Card>(r.data?.data ?? r.data)),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })

  const apiErrorMessage = (e: AxiosError<ApiError>, fallback: string) =>
    e.response?.data?.message || fallback

  const { mutate: createCard, isPending: creating } = useMutation({
    mutationFn: (payload: CardPayload) => api.post('/admin/cards', payload).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'cards'] }); qc.invalidateQueries({ queryKey: ['cards'] }); resetForm(); toast.success('Produk berhasil dibuat!') },
    onError: (e: AxiosError<ApiError>) => toast.error(apiErrorMessage(e, 'Gagal membuat produk')),
  })

  const { mutate: updateCard, isPending: updating } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CardPayload }) =>
      api.put(`/admin/cards/${id}`, payload).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'cards'] }); qc.invalidateQueries({ queryKey: ['cards'] }); resetForm(); toast.success('Produk berhasil diperbarui!') },
    onError: (e: AxiosError<ApiError>) => toast.error(apiErrorMessage(e, 'Gagal memperbarui produk')),
  })

  const { mutate: deleteCard } = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/cards/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'cards'] }); qc.invalidateQueries({ queryKey: ['cards'] }); toast.success('Produk dinonaktifkan') },
    onError: () => toast.error('Gagal menonaktifkan produk'),
  })

  const resetForm = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(false) }

  const openEdit = (card: Card) => {
    setEditing(card)
    setForm({
      name: card.name,
      category: card.category,
      price: String(card.price),
      stock: String(card.stock),
      description: card.description ?? '',
      image_url: card.image_url ?? '',
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(form.price)
    const stock = parseInt(form.stock, 10)
    if (Number.isNaN(price) || price < 0) return toast.error('Harga tidak valid')
    if (Number.isNaN(stock) || stock < 0) return toast.error('Stok tidak valid')

    const payload: CardPayload = {
      name: form.name,
      category: form.category,
      description: form.description,
      image_url: form.image_url,
      price,
      stock,
    }
    if (editing) updateCard({ id: editing.id, payload })
    else createCard(payload)
  }

  const f = (key: keyof typeof EMPTY_FORM, v: string) => setForm({ ...form, [key]: v })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Produk</h1>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }} size="sm">
          <Plus size={14} />
          Tambah Produk
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <Input label="Nama Produk" value={form.name} onChange={(e) => f('name', e.target.value)} required />
          <Select
            label="Kategori"
            value={form.category}
            onChange={(e) => f('category', e.target.value)}
            options={(categories ?? []).map((c) => ({ value: c, label: c }))}
          />
          <Input label="Harga (Rp)" type="number" step="1" value={form.price} onChange={(e) => f('price', e.target.value)} required />
          <Input label="Stok" type="number" value={form.stock} onChange={(e) => f('stock', e.target.value)} required />
          <Input label="URL Gambar" value={form.image_url} onChange={(e) => f('image_url', e.target.value)} className="col-span-2" />
          <Input label="Deskripsi" value={form.description} onChange={(e) => f('description', e.target.value)} className="col-span-2 md:col-span-3" />

          <div className="col-span-2 md:col-span-3 flex gap-3">
            <Button type="submit" loading={creating || updating}>
              {editing ? 'Perbarui' : 'Buat'} Produk
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
          </div>
        </form>
      )}

      <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl overflow-hidden">
       <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="border-b border-[#2a2a38]">
            <tr>
              {['Produk', 'Kategori', 'Harga', 'Stok', 'Aksi'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#5a5550] uppercase tracking-wide font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2a]">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
                ))
              : data?.data.map((card) => (
                  <tr key={card.id} className="hover:bg-[#1c1c28] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          src={card.image_url}
                          alt={card.name}
                          className="w-8 h-10 object-cover rounded"
                          fallback={
                            <div className="w-8 h-10 bg-[#2a2a38] rounded flex items-center justify-center">
                              <Package size={12} className="text-[#5a5550]" />
                            </div>
                          }
                        />
                        <span className="text-[#f0ece4] font-medium truncate max-w-[160px]">{card.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#a09a8e] text-xs">{card.category}</td>
                    <td className="px-4 py-3 text-[#e5b13a] font-semibold">{formatPrice(card.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${card.stock === 0 ? 'text-red-400' : 'text-[#f0ece4]'}`}>{card.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(card)} className="p-1.5 rounded text-[#5a5550] hover:text-[#e5b13a] hover:bg-[#e5b13a11] transition-all cursor-pointer">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => { if (confirm('Nonaktifkan produk ini?')) deleteCard(card.id) }} className="p-1.5 rounded text-[#5a5550] hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
       </div>

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
