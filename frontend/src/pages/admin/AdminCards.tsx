import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Package, X, Upload, ImageIcon, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import api from '../../lib/api'
import { useCategories, normalizePaginated } from '../../hooks/useCatalog'
import type { ApiError, Card, PaginatedResponse } from '../../types'
import { formatPrice } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'
import ProductImage from '../../components/ui/ProductImage'
const EMPTY_FORM = {
  name: '',
  category: 'Raw Card',
  price: '',
  stock: '',
  description: '',
}

// ─── Image Uploader ──────────────────────────────────────────────────────────

interface ImageUploaderProps {
  preview: string | null
  onChange: (file: File | null) => void
}

function ImageUploader({ preview, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return toast.error('File harus berupa gambar')
    if (file.size > 4 * 1024 * 1024) return toast.error('Ukuran gambar maksimal 4MB')
    onChange(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#a09a8e]">Gambar Produk</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        className={`relative aspect-[3/4] rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2 group
          ${dragging ? 'border-[#e5b13a] bg-[#e5b13a08]' : 'border-[#2a2a38] hover:border-[#e5b13a66] hover:bg-[#1c1c28]'}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <Upload size={20} className="text-white" />
              <span className="text-xs text-white font-medium">Ganti Gambar</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null) }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500 transition-colors cursor-pointer z-10"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-[#2a2a38] flex items-center justify-center text-[#a09a8e] group-hover:text-[#e5b13a] transition-colors">
              <ImageIcon size={20} />
            </div>
            <div className="text-center px-4">
              <p className="text-xs text-[#a09a8e] font-medium">Klik atau drag gambar</p>
              <p className="text-[10px] text-[#a09a8e] mt-0.5">JPG, PNG, WebP · Maks 4MB</p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

// ─── Form Modal ──────────────────────────────────────────────────────────────

interface CardFormProps {
  editing: Card | null
  categories: string[]
  onClose: () => void
  onSuccess: () => void
}

function CardForm({ editing, categories, onClose, onSuccess }: CardFormProps) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...(editing
      ? {
          name: editing.name,
          category: editing.category,
          price: String(editing.price),
          stock: String(editing.stock),
          description: editing.description ?? '',
        }
      : {}),
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(editing?.image_url ?? null)

  const apiErrorMessage = (e: AxiosError<ApiError>, fallback: string) =>
    e.response?.data?.message || fallback

  const { mutate: save, isPending } = useMutation({
    mutationFn: (fd: FormData) =>
      editing
        ? api.post(`/admin/cards/${editing.id}?_method=PUT`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        : api.post('/admin/cards', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'cards'] })
      qc.invalidateQueries({ queryKey: ['cards'] })
      toast.success(editing ? 'Produk berhasil diperbarui!' : 'Produk berhasil dibuat!')
      onSuccess()
    },
    onError: (e: AxiosError<ApiError>) => toast.error(apiErrorMessage(e, 'Gagal menyimpan produk')),
  })

  const f = (key: keyof typeof EMPTY_FORM, v: string) => setForm((prev) => ({ ...prev, [key]: v }))

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(form.price)
    const stock = parseInt(form.stock, 10)
    if (Number.isNaN(price) || price <= 0) return toast.error('Harga tidak valid')
    if (Number.isNaN(stock) || stock < 0) return toast.error('Stok tidak valid')

    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('category', form.category)
    fd.append('price', String(price))
    fd.append('stock', String(stock))
    fd.append('description', form.description)
    if (imageFile) fd.append('image', imageFile)

    save(fd)
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#111118] border border-[#2a2a38] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a38] shrink-0">
          <h2 className="font-semibold text-[#f0ece4]">{editing ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6">
            {/* Image uploader */}
            <ImageUploader preview={imagePreview} onChange={handleImageChange} />

            {/* Fields */}
            <div className="flex flex-col gap-4">
              <Input
                label="Nama Produk"
                value={form.name}
                onChange={(e) => f('name', e.target.value)}
                required
                placeholder="cth. Charizard ex 151 PSA 10"
              />
              <Select
                label="Kategori"
                value={form.category}
                onChange={(e) => f('category', e.target.value)}
                options={categories.map((c) => ({ value: c, label: c }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Harga (Rp)"
                  type="number"
                  min="0"
                  step="1000"
                  value={form.price}
                  onChange={(e) => f('price', e.target.value)}
                  required
                  placeholder="0"
                />
                <Input
                  label="Stok"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => f('stock', e.target.value)}
                  required
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#a09a8e]">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => f('description', e.target.value)}
                  rows={4}
                  placeholder="Deskripsi produk (opsional)..."
                  className="w-full rounded-lg border border-[#2a2a38] bg-[#0a0a0f] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#a09a8e] focus:outline-none focus:border-[#e5b13a] resize-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <Button type="submit" loading={isPending} className="flex-1">
              {editing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

// ─── Card Item ────────────────────────────────────────────────────────────────

interface CardItemProps {
  card: Card
  onEdit: (card: Card) => void
  onDelete: (id: number) => void
}

function AdminCardItem({ card, onEdit, onDelete }: CardItemProps) {
  const stockColor = card.stock === 0
    ? 'text-red-400'
    : card.stock <= 5
      ? 'text-[#fbbf24]'
      : 'text-[#a0c878]'

  return (
    <div className="group bg-[#16161f] border border-[#2a2a38] rounded-xl overflow-hidden hover:border-[#e5b13a33] transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-[#1c1c28] overflow-hidden">
        <ProductImage
          src={card.image_url}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#a09a8e]">
              <div className="w-12 h-12 rounded-full bg-[#2a2a38] flex items-center justify-center">
                <Package size={20} className="text-[#3a3a4a]" />
              </div>
              <span className="text-xs">Belum ada gambar</span>
            </div>
          }
        />
        {/* Status badge */}
        {card.stock === 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span>Habis</span>
          </div>
        )}
        {card.stock > 0 && card.stock <= 5 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#fbbf24]/90 text-[#0a0a0f] text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <AlertTriangle size={9} />
            <span>Menipis</span>
          </div>
        )}
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(card)}
            className="flex items-center gap-1.5 bg-[#e5b13a] hover:bg-[#f0c547] text-[#0a0a0f] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
            Edit
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
            Hapus
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-sm font-semibold text-[#f0ece4] truncate leading-tight">{card.name}</p>
        <p className="text-[10px] text-[#a09a8e] truncate">{card.category}</p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className="text-sm font-bold text-[#e5b13a]">{formatPrice(card.price)}</span>
          <span className={`text-xs font-semibold ${stockColor}`}>{card.stock} stok</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminCards() {
  const qc = useQueryClient()
  const { data: categories } = useCategories()
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Card | null>(null)

  const { data, isLoading } = useQuery<PaginatedResponse<Card>>({
    queryKey: ['admin', 'cards', page],
    queryFn: () =>
      api
        .get('/catalog/cards', { params: { page, per_page: 20 } })
        .then((r) => normalizePaginated<Card>(r.data?.data ?? r.data)),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })

  const { mutate: deleteCard } = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/cards/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'cards'] })
      qc.invalidateQueries({ queryKey: ['cards'] })
      toast.success('Produk dinonaktifkan')
    },
    onError: () => toast.error('Gagal menonaktifkan produk'),
  })

  const handleDelete = (id: number) => {
    if (!confirm('Nonaktifkan produk ini?')) return
    deleteCard(id)
  }

  const openEdit = (card: Card) => {
    setEditing(card)
    setShowForm(true)
  }

  const openCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Produk</h1>
          {data && (
            <p className="text-xs text-[#a09a8e] mt-0.5">{data.total} produk terdaftar</p>
          )}
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={14} />
          Tambah Produk
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-[#16161f] border border-[#2a2a38] rounded-xl overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1c1c28] flex items-center justify-center mb-4">
            <Package size={24} className="text-[#a09a8e]" />
          </div>
          <p className="text-[#a09a8e] font-medium">Belum ada produk</p>
          <Button className="mt-4" size="sm" onClick={openCreate}>
            <Plus size={14} />
            Tambah Produk Pertama
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data?.data.map((card) => (
              <AdminCardItem key={card.id} card={card} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.last_page > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#2a2a38]">
              <span className="text-xs text-[#a09a8e]">
                {data.from}–{data.to} dari {data.total} produk
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-[#f0ece4] px-2">
                  {page} / {data.last_page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.last_page}
                  className="p-1.5 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Form modal */}
      {showForm && (
        <CardForm
          editing={editing}
          categories={categories ?? []}
          onClose={closeForm}
          onSuccess={closeForm}
        />
      )}
    </div>
  )
}

