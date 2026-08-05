import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, useCartTotal } from '../../store/cartStore'
import { formatPrice } from '../../lib/utils'
import { buildCheckoutWaLink } from '../../lib/constants'
import Button from '../ui/Button'
import ProductImage from '../ui/ProductImage'

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const total = useCartTotal()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (items.length === 0) return
    const link = buildCheckoutWaLink(
      items.map((line) => ({
        name: line.card.name,
        quantity: line.quantity,
        price: parseFloat(line.card.price),
      })),
    )
    closeCart()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#111118] border-l border-[#2a2a38] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a38]">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-[#e5b13a]" />
                <h2 className="font-semibold text-[#f0ece4]">Keranjang Saya</h2>
                {items.length > 0 && (
                  <span className="text-xs text-[#5a5550]">({items.length} item)</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-[#5a5550] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                  <div className="w-16 h-16 rounded-full bg-[#1c1c28] flex items-center justify-center">
                    <ShoppingCart size={24} className="text-[#5a5550]" />
                  </div>
                  <p className="text-[#a09a8e] text-sm text-center">Keranjang kamu masih kosong</p>
                  <button
                    onClick={() => { closeCart(); navigate('/cards') }}
                    className="text-sm text-[#e5b13a] hover:underline cursor-pointer"
                  >
                    Lihat koleksi kartu →
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#1e1e2a]">
                  {items.map((item) => (
                    <li key={item.card.id} className="flex gap-3 p-4">
                      <Link to={`/cards/${item.card.id}`} onClick={closeCart} className="shrink-0">
                        <ProductImage
                          src={item.card.image_url}
                          alt={item.card.name}
                          className="w-14 h-[72px] object-cover rounded-lg border border-[#2a2a38]"
                          fallback={
                            <div className="w-14 h-[72px] bg-[#1c1c28] rounded-lg border border-[#2a2a38] flex items-center justify-center text-[#5a5550] text-xs">
                              P
                            </div>
                          }
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link to={`/cards/${item.card.id}`} onClick={closeCart}>
                          <p className="text-sm font-medium text-[#f0ece4] truncate hover:text-[#e5b13a] transition-colors">
                            {item.card.name}
                          </p>
                        </Link>
                        <p className="text-xs text-[#5a5550] mt-0.5">
                          {item.card.category}
                        </p>
                        <p className="text-sm font-semibold text-[#e5b13a] mt-1">
                          {formatPrice(parseFloat(item.card.price) * item.quantity)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 rounded border border-[#2a2a38] flex items-center justify-center text-[#a09a8e] hover:border-[#e5b13a44] hover:text-[#f0ece4] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm text-[#f0ece4] w-5 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                            disabled={item.quantity >= item.card.stock}
                            className="w-6 h-6 rounded border border-[#2a2a38] flex items-center justify-center text-[#a09a8e] hover:border-[#e5b13a44] hover:text-[#f0ece4] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => removeItem(item.card.id)}
                            className="ml-auto text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#2a2a38] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#a09a8e]">Subtotal</span>
                  <span className="font-bold text-[#f0ece4] text-lg">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-[#5a5550]">
                  Checkout akan membuka WhatsApp berisi draft pesananmu untuk dikonfirmasi ke admin.
                </p>
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Checkout via WhatsApp
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-[#5a5550] hover:text-[#a09a8e] transition-colors cursor-pointer"
                >
                  Lanjut Belanja
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
