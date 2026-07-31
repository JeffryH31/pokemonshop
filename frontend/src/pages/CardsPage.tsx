import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layers } from 'lucide-react'
import { useCards } from '../hooks/useCatalog'
import type { CardFilters } from '../hooks/useCatalog'
import CardGrid from '../components/cards/CardGrid'
import CardFiltersBar from '../components/cards/CardFilters'
import { CardSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'

export default function CardsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filters, setFilters] = useState<CardFilters>({
    page: Number(searchParams.get('page')) || 1,
    per_page: 20,
    sort: searchParams.get('sort') || undefined,
    category: searchParams.get('category') || undefined,
  })

  useEffect(() => {
    setFilters({
      page: Number(searchParams.get('page')) || 1,
      per_page: 20,
      sort: searchParams.get('sort') || undefined,
      category: searchParams.get('category') || undefined,
    })
  }, []) // eslint-disable-line

  const { data, isLoading, isFetching } = useCards(filters)

  const handleFiltersChange = (newFilters: CardFilters) => {
    setFilters(newFilters)
    const params: Record<string, string> = {}
    if (newFilters.page && newFilters.page > 1) params.page = String(newFilters.page)
    if (newFilters.sort) params.sort = newFilters.sort
    if (newFilters.category) params.category = String(newFilters.category)
    if (newFilters.min_price) params.min_price = String(newFilters.min_price)
    if (newFilters.max_price) params.max_price = String(newFilters.max_price)
    setSearchParams(params)
  }

  const changePage = (p: number) => handleFiltersChange({ ...filters, page: p })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Semua Produk</h1>
          {data && (
            <p className="text-sm text-[#5a5550] mt-1">
              {data.total.toLocaleString('id-ID')} produk tersedia
            </p>
          )}
        </div>
      </div>

      <CardFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen(!filtersOpen)}
      />

      <div className="mt-6 relative">
        {(isLoading || isFetching) && data && (
          <div className="absolute inset-0 bg-[#0a0a0f]/50 z-10 rounded-xl" />
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <CardGrid cards={data.data} />

            {data.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={filters.page === 1}
                  onClick={() => changePage((filters.page ?? 1) - 1)}
                >
                  Sebelumnya
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(data.last_page, 7) }, (_, i) => {
                    const page = i + 1
                    const current = filters.page ?? 1
                    if (data.last_page > 7) {
                      if (page > 3 && page < data.last_page - 2 && Math.abs(page - current) > 1) {
                        if (page === 4) return <span key={page} className="text-[#5a5550] px-1">…</span>
                        return null
                      }
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          page === current
                            ? 'bg-[#e5b13a] text-[#0a0a0f]'
                            : 'text-[#a09a8e] hover:bg-[#1c1c28] hover:text-[#f0ece4]'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={filters.page === data.last_page}
                  onClick={() => changePage((filters.page ?? 1) + 1)}
                >
                  Berikutnya
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1c1c28] flex items-center justify-center mb-4">
              <Layers size={24} className="text-[#5a5550]" />
            </div>
            <p className="text-[#a09a8e] font-medium">Produk tidak ditemukan</p>
            <p className="text-sm text-[#5a5550] mt-1">Coba ubah filter pencarian kamu</p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => handleFiltersChange({ page: 1, per_page: 20 })}
            >
              Hapus semua filter
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
