import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import { useSets } from '../../hooks/useCatalog'
import type { Card, PaginatedResponse } from '../../types'
import { formatPrice, getRarityColor, getConditionColor } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

const RARITIES = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare', 'Secret Rare']
const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Poor']

const EMPTY_FORM = {
  name: '', set_id: '', rarity: 'Common', condition: 'Near Mint',
  price: '', stock: '', description: '', image_url: '',
}

export default function AdminCards() {
  const qc = useQueryClient()
  const { data: sets } = useSets()
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Card | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data, isLoading } = useQuery<PaginatedResponse<Card>>({
    queryKey: ['admin', 'cards', page],
    queryFn: () => api.get('/catalog/cards', { params: { page, per_page: 15 } }).then((r) => r.data),
    staleTime: 30 * 1000,
  })

  const { mutate: createCard, isPending: creating } = useMutation({
    mutationFn: (payload: any) => api.post('/admin/cards', payload).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'cards'] }); qc.invalidateQueries({ queryKey: ['cards'] }); resetForm(); toast.success('Kartu berhasil dibuat!') },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal membuat kartu'),
  })

  const { mutate: updateCard, isPending: updating } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      api.put(`/admin/cards/${id}`, payload).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'cards'] }); qc.invalidateQueries({ queryKey: ['cards'] }); resetForm(); toast.success('Kartu berhasil diperbarui!') },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal memperbarui kartu'),
  })

  const { mutate: deleteCard } = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/cards/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'cards'] }); qc.invalidateQueries({ queryKey: ['cards'] }); toast.success('Kartu dinonaktifkan') },
    onError: () => toast.error('Gagal menonaktifkan kartu'),
  })

  const { mutate: updateStock } = useMutation({
    mutationFn: ({ id, stock }: { id: number; stock: number }) =>
      api.patch(`/admin/cards/${id}/stock`, { stock }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'cards'] }); qc.invalidateQueries({ queryKey: ['cards'] }); toast.success('Stok diperbarui') },
  })

  const resetForm = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(false) }

  const openEdit = (card: Card) => {
    setEditing(card)
    setForm({
      name: card.name, set_id: String(card.set_id), rarity: card.rarity, condition: card.condition,
      price: String(card.price), stock: String(card.stock),
      description: card.description ?? '', image_url: card.image_url ?? '',
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), set_id: parseInt(form.set_id) }
    if (editing) updateCard({ id: editing.id, payload })
    else createCard(payload)
  }

  const f = (key: keyof typeof EMPTY_FORM, v: string) => setForm({ ...form, [key]: v })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Kartu</h1>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }} size="sm">
          <Plus size={14} />
          Tambah Kartu
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5 mb-6 grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <Input label="Nama Kartu" value={form.name} onChange={(e) => f('name', e.target.value)} required />
          <Select label="Set" value={form.set_id} onChange={(e) => f('set_id', e.target.value)} required
            placeholder="Pilih set"
            options={(sets ?? []).map((s) => ({ value: s.id, label: s.name }))}
          />
          <Select label="Kelangkaan" value={form.rarity} onChange={(e) => f('rarity', e.target.value)}
            options={RARITIES.map((r) => ({ value: r, label: r }))}
          />
          <Select label="Kondisi" value={form.condition} onChange={(e) => f('condition', e.target.value)}
            options={CONDITIONS.map((c) => ({ value: c, label: c }))}
          />
          <Input label="Harga (Rp)" type="number" step="1" value={form.price} onChange={(e) => f('price', e.target.value)} required />
          <Input label="Stok" type="number" value={form.stock} onChange={(e) => f('stock', e.target.value)} required />
          <Input label="URL Gambar" value={form.image_url} onChange={(e) => f('image_url', e.target.value)} className="col-span-2" />
          <Input label="Deskripsi" value={form.description} onChange={(e) => f('description', e.target.value)} className="col-span-2 md:col-span-3" />

          <div className="col-span-2 md:col-span-3 flex gap-3">
            <Button type="submit" loading={creating || updating}>
              {editing ? 'Perbarui' : 'Buat'} Kartu
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
          </div>
        </form>
      )}

      <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#2a2a38]">
            <tr>
              {['Kartu', 'Set', 'Kelangkaan', 'Kondisi', 'Harga', 'Stok', 'Aksi'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#5a5550] uppercase tracking-wide font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2a]">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
                ))
              : data?.data.map((card) => (
                  <tr key={card.id} className="hover:bg-[#1c1c28] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {card.image_url ? (
                          <img src={card.image_url} alt={card.name} className="w-8 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-8 h-10 bg-[#2a2a38] rounded flex items-center justify-center">
                            <Package size={12} className="text-[#5a5550]" />
                          </div>
                        )}
                        <span className="text-[#f0ece4] font-medium truncate max-w-[130px]">{card.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#5a5550] truncate max-w-[100px]">{card.set?.name}</td>
                    <td className="px-4 py-3"><Badge color={getRarityColor(card.rarity)}>{card.rarity}</Badge></td>
                    <td className="px-4 py-3"><Badge color={getConditionColor(card.condition)}>{card.condition}</Badge></td>
                    <td className="px-4 py-3 text-[#e5b13a] font-semibold">{formatPrice(card.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm ${card.stock === 0 ? 'text-red-400' : 'text-[#f0ece4]'}`}>{card.stock}</span>
                        <button
                          onClick={() => {
                            const newStock = prompt('Jumlah stok baru:', String(card.stock))
                            if (newStock !== null) updateStock({ id: card.id, stock: parseInt(newStock) })
                          }}
                          className="opacity-0 group-hover:opacity-100 ml-1 text-xs text-[#e5b13a] hover:underline transition-opacity"
                        >
                          edit
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(card)} className="p-1.5 rounded text-[#5a5550] hover:text-[#e5b13a] hover:bg-[#e5b13a11] transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => { if (confirm('Nonaktifkan kartu ini?')) deleteCard(card.id) }} className="p-1.5 rounded text-[#5a5550] hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={13} />
                        </button>
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
