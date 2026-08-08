import { Filter, ChevronDown, X } from 'lucide-react'
import { useCategories } from '../../hooks/useCatalog'
import type { CardFilters } from '../../hooks/useCatalog'
import Select from '../ui/Select'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price_asc', label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
  { value: 'name_asc', label: 'Nama: A–Z' },
]

interface Props {
  filters: CardFilters
  onChange: (filters: CardFilters) => void
  filtersOpen: boolean
  onToggleFilters: () => void
}

export default function CardFiltersBar({ filters, onChange, filtersOpen, onToggleFilters }: Props) {
  const { data: categories } = useCategories()

  const activeCount = [filters.category, filters.min_price, filters.max_price].filter(Boolean).length

  const clearAll = () => onChange({ page: 1, sort: filters.sort })

  const set = (key: keyof CardFilters, value: string | number | undefined) =>
    onChange({ ...filters, [key]: value || undefined, page: 1 })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          options={SORT_OPTIONS}
          value={filters.sort || ''}
          onChange={(e) => set('sort', e.target.value)}
          placeholder="Urutkan"
          className="w-44"
        />

        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#2a2a38] bg-[#16161f] text-sm text-[#c2bcb0] hover:border-[#e5b13a44] hover:text-[#f0ece4] transition-all cursor-pointer"
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
            className="flex items-center gap-1 text-sm text-[#c2bcb0] hover:text-red-400 transition-colors cursor-pointer"
          >
            <X size={13} />
            Hapus Filter
          </button>
        )}

        {/* Active category badge */}
        {filters.category && (
          <span className="flex items-center gap-1.5 text-xs bg-[#e5b13a11] text-[#e5b13a] border border-[#e5b13a33] px-2.5 py-1 rounded-full font-medium">
            {filters.category}
            <button onClick={() => set('category', undefined)} className="hover:text-white transition-colors cursor-pointer">
              <X size={11} />
            </button>
          </span>
        )}
      </div>

      {filtersOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#16161f] rounded-xl border border-[#2a2a38]">
          <Select
            label="Kategori"
            value={filters.category || ''}
            onChange={(e) => set('category', e.target.value)}
            placeholder="Semua Kategori"
            options={(categories ?? []).map((c) => ({ value: c, label: c }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#c2bcb0]">Harga Min</label>
            <input
              type="number"
              min={0}
              placeholder="Rp 0"
              value={filters.min_price ?? ''}
              onChange={(e) => set('min_price', e.target.value)}
              className="w-full rounded-lg border border-[#2a2a38] bg-[#0a0a0f] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#c2bcb0] focus:outline-none focus:border-[#e5b13a]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#c2bcb0]">Harga Maks</label>
            <input
              type="number"
              min={0}
              placeholder="∞"
              value={filters.max_price ?? ''}
              onChange={(e) => set('max_price', e.target.value)}
              className="w-full rounded-lg border border-[#2a2a38] bg-[#0a0a0f] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#c2bcb0] focus:outline-none focus:border-[#e5b13a]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

