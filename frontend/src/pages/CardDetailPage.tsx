import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Star, Package } from 'lucide-react'
import { useState } from 'react'
import { useCard } from '../hooks/useCatalog'
import { useAddToCart } from '../hooks/useCart'
import { useAuthStore } from '../store/authStore'
import { formatPrice, getRarityColor, getConditionColor } from '../lib/utils'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { useNavigate } from 'react-router-dom'

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: card, isLoading } = useCard(id!)
  const { mutate: addToCart, isPending } = useAddToCart()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    addToCart({ card_id: card!.id, quantity: qty })
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
        <p className="text-[#a09a8e]">Card not found</p>
        <Link to="/cards" className="text-sm text-[#e5b13a] mt-2 hover:underline">
          Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        to="/cards"
        className="inline-flex items-center gap-2 text-sm text-[#5a5550] hover:text-[#a09a8e] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="aspect-[3/4] bg-[#16161f] rounded-2xl overflow-hidden border border-[#2a2a38] relative group">
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#5a5550]">
                <div className="w-20 h-20 rounded-full bg-[#2a2a38] flex items-center justify-center">
                  <span className="font-display text-4xl text-[#3a3a4a]">P</span>
                </div>
                <span className="text-sm">No Image Available</span>
              </div>
            )}

            {/* Rarity glow */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
              style={{
                background: `linear-gradient(to top, ${getRarityColor(card.rarity)}44, transparent)`,
              }}
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col"
        >
          {/* Set */}
          <p className="text-xs text-[#5a5550] uppercase tracking-widest font-semibold mb-2">
            {card.set?.name ?? 'Unknown Set'}
          </p>

          <h1 className="font-display text-3xl font-bold text-[#f0ece4] mb-4">{card.name}</h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge color={getRarityColor(card.rarity)} variant="outline">
              <Star size={10} className="mr-1" />
              {card.rarity}
            </Badge>
            <Badge color={getConditionColor(card.condition)} variant="outline">
              {card.condition}
            </Badge>
          </div>

          {/* Price */}
          <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-4 mb-6">
            <p className="text-xs text-[#5a5550] uppercase tracking-wide mb-1">Price</p>
            <p className="text-4xl font-bold text-[#e5b13a] font-display">{formatPrice(card.price)}</p>
          </div>

          {/* Description */}
          {card.description && (
            <p className="text-sm text-[#a09a8e] leading-relaxed mb-6">{card.description}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <Package size={14} className={card.is_available ? 'text-green-400' : 'text-red-400'} />
            <span className={`text-sm font-medium ${card.is_available ? 'text-green-400' : 'text-red-400'}`}>
              {card.is_available ? `${card.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity + Add to cart */}
          {card.is_available && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#2a2a38] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2.5 text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-colors text-lg"
                >
                  −
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-[#f0ece4] min-w-[3rem] text-center border-x border-[#2a2a38]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(card.stock, qty + 1))}
                  className="px-3 py-2.5 text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-colors text-lg"
                >
                  +
                </button>
              </div>

              <Button onClick={handleAdd} loading={isPending} size="lg" className="flex-1">
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
            </div>
          )}

          {!card.is_available && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-red-400 font-medium">This card is currently out of stock</p>
            </div>
          )}

          {/* Card specs */}
          <div className="mt-8 border-t border-[#2a2a38] pt-6 grid grid-cols-2 gap-4">
            {[
              { label: 'Set', value: card.set?.name ?? '—' },
              { label: 'Rarity', value: card.rarity },
              { label: 'Condition', value: card.condition },
              { label: 'Stock', value: card.stock.toString() },
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
