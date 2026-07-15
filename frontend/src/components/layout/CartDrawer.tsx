import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../../hooks/useCart'
import { formatPrice } from '../../lib/utils'
import Button from '../ui/Button'

export default function CartDrawer() {
  const { isOpen, closeCart } = useCartStore()
  const { data: cart } = useCart()
  const { mutate: update, isPending: updating } = useUpdateCartItem()
  const { mutate: remove, isPending: removing } = useRemoveCartItem()
  const navigate = useNavigate()

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
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
                <h2 className="font-semibold text-[#f0ece4]">Your Cart</h2>
                {cart && cart.items.length > 0 && (
                  <span className="text-xs text-[#5a5550]">({cart.items.length} items)</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-[#5a5550] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                  <div className="w-16 h-16 rounded-full bg-[#1c1c28] flex items-center justify-center">
                    <ShoppingCart size={24} className="text-[#5a5550]" />
                  </div>
                  <p className="text-[#a09a8e] text-sm text-center">Your cart is empty</p>
                  <button
                    onClick={() => { closeCart(); navigate('/cards') }}
                    className="text-sm text-[#e5b13a] hover:underline"
                  >
                    Browse cards →
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#1e1e2a]">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex gap-3 p-4">
                      {/* Card image */}
                      <Link to={`/cards/${item.card_id}`} onClick={closeCart} className="shrink-0">
                        {item.card?.image_url ? (
                          <img
                            src={item.card.image_url}
                            alt={item.card.name}
                            className="w-14 h-[72px] object-cover rounded-lg border border-[#2a2a38]"
                          />
                        ) : (
                          <div className="w-14 h-[72px] bg-[#1c1c28] rounded-lg border border-[#2a2a38] flex items-center justify-center text-[#5a5550] text-xs">
                            P
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/cards/${item.card_id}`} onClick={closeCart}>
                          <p className="text-sm font-medium text-[#f0ece4] truncate hover:text-[#e5b13a] transition-colors">
                            {item.card?.name}
                          </p>
                        </Link>
                        <p className="text-xs text-[#5a5550] mt-0.5">
                          {item.card?.condition} · {item.card?.rarity}
                        </p>
                        <p className="text-sm font-semibold text-[#e5b13a] mt-1">
                          {formatPrice(item.subtotal)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => update({ cardId: item.card_id, quantity: item.quantity - 1 })}
                            disabled={item.quantity <= 1 || updating}
                            className="w-6 h-6 rounded border border-[#2a2a38] flex items-center justify-center text-[#a09a8e] hover:border-[#e5b13a44] hover:text-[#f0ece4] disabled:opacity-40 transition-all"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm text-[#f0ece4] w-5 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => update({ cardId: item.card_id, quantity: item.quantity + 1 })}
                            disabled={updating || item.quantity >= (item.card?.stock ?? 99)}
                            className="w-6 h-6 rounded border border-[#2a2a38] flex items-center justify-center text-[#a09a8e] hover:border-[#e5b13a44] hover:text-[#f0ece4] disabled:opacity-40 transition-all"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => remove(item.card_id)}
                            disabled={removing}
                            className="ml-auto text-[#5a5550] hover:text-red-400 transition-colors"
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
            {cart && cart.items.length > 0 && (
              <div className="border-t border-[#2a2a38] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#a09a8e]">Subtotal</span>
                  <span className="font-bold text-[#f0ece4] text-lg">{formatPrice(cart.total)}</span>
                </div>
                <p className="text-xs text-[#5a5550]">Shipping & taxes calculated at checkout</p>
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Checkout
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-[#5a5550] hover:text-[#a09a8e] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
