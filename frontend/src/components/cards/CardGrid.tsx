import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import type { Card } from '../../types'
import { formatPrice, getRarityColor, getConditionColor } from '../../lib/utils'
import Badge from '../ui/Badge'
import { useAddToCart } from '../../hooks/useCart'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

interface CardItemProps {
  card: Card
  index?: number
}

export function CardItem({ card, index = 0 }: CardItemProps) {
  const { mutate: addToCart, isPending } = useAddToCart()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    addToCart({ card_id: card.id, quantity: 1 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link to={`/cards/${card.id}`} className="group block">
        <div className="relative bg-[#16161f] rounded-xl overflow-hidden border border-[#2a2a38] hover:border-[#e5b13a44] transition-all duration-300 hover:shadow-lg hover:shadow-[#e5b13a0a] card-holo">
          {/* Gambar */}
          <div className="relative aspect-[3/4] bg-[#1c1c28] overflow-hidden">
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#5a5550]">
                <div className="w-12 h-12 rounded-full bg-[#2a2a38] flex items-center justify-center">
                  <span className="font-display text-lg text-[#3a3a4a]">P</span>
                </div>
                <span className="text-xs">Tidak Ada Gambar</span>
              </div>
            )}

            {/* Stok habis */}
            {!card.is_available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-xs font-semibold text-[#f0ece4] bg-[#0a0a0f]/80 px-3 py-1.5 rounded-full border border-[#2a2a38]">
                  Stok Habis
                </span>
              </div>
            )}

            {/* Aksi cepat */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); navigate(`/cards/${card.id}`) }}
                className="w-9 h-9 rounded-full bg-[#f0ece4] flex items-center justify-center text-[#0a0a0f] hover:bg-white transition-colors shadow-lg"
                aria-label="Lihat kartu"
              >
                <Eye size={15} />
              </button>
              {card.is_available && (
                <button
                  onClick={handleAddToCart}
                  disabled={isPending}
                  className="w-9 h-9 rounded-full bg-[#e5b13a] flex items-center justify-center text-[#0a0a0f] hover:bg-[#f0c547] transition-colors shadow-lg disabled:opacity-60"
                  aria-label="Tambah ke keranjang"
                >
                  <ShoppingCart size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-[#f0ece4] truncate group-hover:text-[#e5b13a] transition-colors">
              {card.name}
            </h3>
            <p className="text-xs text-[#5a5550] mt-0.5 truncate">{card.set?.name}</p>

            <div className="flex gap-1.5 mt-2 flex-wrap">
              <Badge color={getRarityColor(card.rarity)}>{card.rarity}</Badge>
              <Badge color={getConditionColor(card.condition)}>{card.condition}</Badge>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-base font-bold text-[#e5b13a]">{formatPrice(card.price)}</span>
              {card.is_available && (
                <button
                  onClick={handleAddToCart}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs bg-[#e5b13a11] hover:bg-[#e5b13a22] text-[#e5b13a] border border-[#e5b13a33] hover:border-[#e5b13a66] px-2.5 py-1.5 rounded-lg transition-all font-medium disabled:opacity-60"
                >
                  <ShoppingCart size={12} />
                  Beli
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

interface CardGridProps {
  cards: Card[]
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <CardItem key={card.id} card={card} index={i} />
      ))}
    </div>
  )
}
