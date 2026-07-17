import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import type { Set } from '../../types'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'

const EMPTY = { name: '', description: '' }

export default function AdminSets() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Set | null>(null)
  const [form, setForm] = useState(EMPTY)

  const { data: sets, isLoading } = useQuery<Set[]>({
    queryKey: ['admin', 'sets'],
    queryFn: () => api.get('/catalog/sets').then((r) => r.data.data ?? r.data),
  })

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: (payload: any) => api.post('/admin/sets', payload).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'sets'] }); qc.invalidateQueries({ queryKey: ['sets'] }); reset(); toast.success('Set berhasil dibuat!') },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal'),
  })

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      api.put(`/admin/sets/${id}`, payload).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'sets'] }); qc.invalidateQueries({ queryKey: ['sets'] }); reset(); toast.success('Set berhasil diperbarui!') },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal'),
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/sets/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'sets'] }); qc.invalidateQueries({ queryKey: ['sets'] }); toast.success('Set dinonaktifkan') },
  })

  const reset = () => { setForm(EMPTY); setEditing(null); setShowForm(false) }

  const openEdit = (s: Set) => {
    setEditing(s)
    setForm({ name: s.name, description: s.description ?? '' })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) update({ id: editing.id, payload: form })
    else create(form)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Set</h1>
        <Button onClick={() => { reset(); setShowForm(!showForm) }} size="sm">
          <Plus size={14} />
          Tambah Set
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nama Set" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3">
            <Button type="submit" loading={creating || updating}>{editing ? 'Perbarui' : 'Buat'} Set</Button>
            <Button type="button" variant="ghost" onClick={reset}>Batal</Button>
          </div>
        </form>
      )}

      <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#2a2a38]">
            <tr>
              {['Nama', 'Slug', 'Status', 'Aksi'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#5a5550] uppercase tracking-wide font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2a]">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
                ))
              : (sets ?? []).map((set) => (
                  <tr key={set.id} className="hover:bg-[#1c1c28] transition-colors">
                    <td className="px-4 py-3 text-[#f0ece4] font-medium">{set.name}</td>
                    <td className="px-4 py-3 text-[#5a5550] font-mono text-xs">{set.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${set.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {set.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(set)} className="p-1.5 rounded text-[#5a5550] hover:text-[#e5b13a] hover:bg-[#e5b13a11] transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => { if (confirm('Nonaktifkan set ini?')) remove(set.id) }} className="p-1.5 rounded text-[#5a5550] hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
