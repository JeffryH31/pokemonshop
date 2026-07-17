import { useState } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { useSets, useRarities } from '../../hooks/useCatalog'
import type { CardFilters } from '../../hooks/useCatalog'
import Select from '../ui/Select'

const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Poor']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price_asc', label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
  { value: 'name_asc', label: 'Nama: A–Z' },
  { value: 'name_desc', label: 'Nama: Z–A' },
]

interface Props {
  filters: CardFilters
  onChange: (filters: CardFilters) => void
}

export default function CardFiltersBar({ filters, onChange }: Props) {
  const { data: sets } = useSets()
  const { data: rarities } = useRarities()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeCount = [filters.set_id, filters.rarity, filters.condition, filters.min_price, filters.max_price].filter(
    Boolean,
  ).length

  const clearAll = () => onChange({ page: 1, sort: filters.sort })

  const set = (key: keyof CardFilters, value: string | number | undefined) =>
    onChange({ ...filters, [key]: value || undefined, page: 1 })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Select
          options={SORT_OPTIONS}
          value={filters.sort || ''}
          onChange={(e) => set('sort', e.target.value)}
          placeholder="Urutkan"
          className="w-44"
        />

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#2a2a38] bg-[#16161f] text-sm text-[#a09a8e] hover:border-[#e5b13a44] hover:text-[#f0ece4] transition-all"
        >
          <Filter size={14} />
          Filter
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#e5b13a] text-[#0a0a0f] text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
        </button>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-sm text-[#5a5550] hover:text-red-400 transition-colors"
          >
            <X size={13} />
            Hapus Filter
          </button>
        )}
      </div>

      {filtersOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-4 bg-[#16161f] rounded-xl border border-[#2a2a38]">
          <Select
            label="Set"
            value={filters.set_id || ''}
            onChange={(e) => set('set_id', e.target.value)}
            placeholder="Semua Set"
            options={(sets ?? []).map((s) => ({ value: s.id, label: s.name }))}
          />
          <Select
            label="Kelangkaan"
            value={filters.rarity || ''}
            onChange={(e) => set('rarity', e.target.value)}
            placeholder="Semua Kelangkaan"
            options={(rarities ?? []).map((r) => ({ value: r, label: r }))}
          />
          <Select
            label="Kondisi"
            value={filters.condition || ''}
            onChange={(e) => set('condition', e.target.value)}
            placeholder="Semua Kondisi"
            options={CONDITIONS.map((c) => ({ value: c, label: c }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#a09a8e]">Harga Min</label>
            <input
              type="number"
              min={0}
              placeholder="Rp 0"
              value={filters.min_price ?? ''}
              onChange={(e) => set('min_price', e.target.value)}
              className="w-full rounded-lg border border-[#2a2a38] bg-[#16161f] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#5a5550] focus:outline-none focus:border-[#e5b13a]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#a09a8e]">Harga Maks</label>
            <input
              type="number"
              min={0}
              placeholder="∞"
              value={filters.max_price ?? ''}
              onChange={(e) => set('max_price', e.target.value)}
              className="w-full rounded-lg border border-[#2a2a38] bg-[#16161f] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#5a5550] focus:outline-none focus:border-[#e5b13a]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
