import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Package, Heart } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCard } from '../hooks/useCatalog'
import { useCartStore } from '../store/cartStore'
import { useFavouritesStore } from '../store/favouritesStore'
import { formatPrice } from '../lib/utils'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import ProductImage from '../components/ui/ProductImage'

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: card, isLoading } = useCard(id!)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const toggleFav = useFavouritesStore((s) => s.toggle)
  const isFav = useFavouritesStore((s) => (card ? s.isFavourite(card.id) : false))
  const [qty, setQty] = useState(1)

  const handleAdd = () => {
    if (!card) return
    addItem(card, qty)
    openCart()
    toast.success('Ditambahkan ke keranjang!')
  }

  const handleToggleFav = () => {
    if (!card) return
    toggleFav(card)
    toast.success(isFav ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit')
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full mt-6" />
          </div>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[#a09a8e]">Kartu tidak ditemukan</p>
        <Link to="/cards" className="text-sm text-[#e5b13a] mt-2 hover:underline">
          Kembali ke katalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/cards"
        className="inline-flex items-center gap-2 text-sm text-[#5a5550] hover:text-[#a09a8e] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Kembali ke katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gambar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="aspect-[3/4] bg-[#16161f] rounded-2xl overflow-hidden border border-[#2a2a38] relative group">
            <ProductImage
              src={card.image_url}
              alt={card.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#5a5550]">
                  <div className="w-20 h-20 rounded-full bg-[#2a2a38] flex items-center justify-center">
                    <span className="font-display text-4xl text-[#3a3a4a]">P</span>
                  </div>
                  <span className="text-sm">Tidak Ada Gambar</span>
                </div>
              }
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 bg-gradient-to-t from-[#e5b13a44] to-transparent" />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col"
        >
          <p className="text-xs text-[#5a5550] uppercase tracking-widest font-semibold mb-2">
            {card.category}
          </p>

          <h1 className="font-display text-3xl font-bold text-[#f0ece4] mb-4">{card.name}</h1>

          <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-4 mb-6">
            <p className="text-xs text-[#5a5550] uppercase tracking-wide mb-1">Harga</p>
            <p className="text-4xl font-bold text-[#e5b13a] font-display">{formatPrice(card.price)}</p>
          </div>

          {card.description && (
            <p className="text-sm text-[#a09a8e] leading-relaxed mb-6">{card.description}</p>
          )}

          <div className="flex items-center gap-2 mb-6">
            <Package size={14} className={card.is_available ? 'text-green-400' : 'text-red-400'} />
            <span className={`text-sm font-medium ${card.is_available ? 'text-green-400' : 'text-red-400'}`}>
              {card.stock === 0
                ? 'Out of Stock'
                : card.stock === 1
                  ? 'Cuma ada 1 nih! Mungkin rejekimu 😜'
                  : `${card.stock} stok tersedia`}
            </span>
          </div>

          {card.is_available && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#2a2a38] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2.5 text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-colors text-lg cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-[#f0ece4] min-w-[3rem] text-center border-x border-[#2a2a38]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(card.stock, qty + 1))}
                  className="px-3 py-2.5 text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-colors text-lg cursor-pointer"
                >
                  +
                </button>
              </div>
              <Button onClick={handleAdd} size="lg" className="flex-1">
                <ShoppingCart size={16} />
                Tambah ke Keranjang
              </Button>
              <button
                onClick={handleToggleFav}
                className={`h-full aspect-square shrink-0 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                  isFav
                    ? 'bg-[#e5b13a] border-[#e5b13a] text-[#0a0a0f]'
                    : 'border-[#2a2a38] text-[#a09a8e] hover:border-[#e5b13a66] hover:text-[#e5b13a]'
                }`}
                aria-label={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                aria-pressed={isFav}
              >
                <Heart size={18} fill={isFav ? '#0a0a0f' : 'none'} />
              </button>
            </div>
          )}

          {/* Favorit — tetap tersedia meski stok habis */}
          {!card.is_available && (
            <button
              onClick={handleToggleFav}
              className={`flex items-center justify-center gap-2 w-full mb-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                isFav
                  ? 'bg-[#e5b13a] border-[#e5b13a] text-[#0a0a0f]'
                  : 'border-[#2a2a38] text-[#a09a8e] hover:border-[#e5b13a66] hover:text-[#e5b13a]'
              }`}
              aria-pressed={isFav}
            >
              <Heart size={16} fill={isFav ? '#0a0a0f' : 'none'} />
              {isFav ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
            </button>
          )}

          {!card.is_available && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-red-400 font-medium">Kartu ini sedang kehabisan stok</p>
            </div>
          )}

          <div className="mt-8 border-t border-[#2a2a38] pt-6 grid grid-cols-2 gap-4">
            {[
              { label: 'Kategori', value: card.category },
              { label: 'Stok', value: card.stock.toString() },
            ].map((spec) => (
              <div key={spec.label}>
                <p className="text-xs text-[#5a5550] uppercase tracking-wide">{spec.label}</p>
                <p className="text-sm text-[#f0ece4] font-medium mt-0.5">{spec.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
