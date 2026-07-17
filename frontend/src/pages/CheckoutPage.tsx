import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, User, Package } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useCheckout } from '../hooks/useOrders'
import { useAuthStore } from '../store/authStore'
import { formatPrice } from '../lib/utils'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function CheckoutPage() {
  const { isAuthenticated } = useAuthStore()
  const { data: cart } = useCart()
  const { mutate: checkout, isPending } = useCheckout()

  const [form, setForm] = useState({
    recipient_name: '',
    street_address: '',
    city: '',
    postal_code: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isAuthenticated) return <Navigate to="/login" />
  if (!cart || cart.items.length === 0) return <Navigate to="/cards" />

  const field = (key: keyof typeof form, value: string) =>
    setForm({ ...form, [key]: value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!form.recipient_name.trim()) newErrors.recipient_name = 'Wajib diisi'
    if (!form.street_address.trim()) newErrors.street_address = 'Wajib diisi'
    if (!form.city.trim()) newErrors.city = 'Wajib diisi'
    if (!form.postal_code.trim()) newErrors.postal_code = 'Wajib diisi'
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)
    setErrors({})
    checkout(form)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-bold text-[#f0ece4] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form pengiriman */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={16} className="text-[#e5b13a]" />
                <h2 className="text-sm font-semibold text-[#f0ece4]">Alamat Pengiriman</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Penerima"
                  placeholder="Nama lengkap"
                  value={form.recipient_name}
                  onChange={(e) => field('recipient_name', e.target.value)}
                  error={errors.recipient_name}
                  icon={<User size={14} />}
                />
                <Input
                  label="Alamat Lengkap"
                  placeholder="Jl. Contoh No. 10, RT/RW"
                  value={form.street_address}
                  onChange={(e) => field('street_address', e.target.value)}
                  error={errors.street_address}
                  icon={<MapPin size={14} />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Kota"
                    placeholder="Jakarta"
                    value={form.city}
                    onChange={(e) => field('city', e.target.value)}
                    error={errors.city}
                  />
                  <Input
                    label="Kode Pos"
                    placeholder="12345"
                    value={form.postal_code}
                    onChange={(e) => field('postal_code', e.target.value)}
                    error={errors.postal_code}
                  />
                </div>

                <Button type="submit" loading={isPending} className="w-full" size="lg">
                  Buat Pesanan — {formatPrice(cart.total)}
                </Button>
              </form>
            </div>
          </div>

          {/* Ringkasan pesanan */}
          <div className="md:col-span-2">
            <div className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-[#e5b13a]" />
                <h2 className="text-sm font-semibold text-[#f0ece4]">Ringkasan Pesanan</h2>
              </div>

              <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    {item.card?.image_url ? (
                      <img
                        src={item.card.image_url}
                        alt={item.card.name}
                        className="w-10 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-12 bg-[#2a2a38] rounded flex items-center justify-center text-[#5a5550] text-xs">
                        P
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#f0ece4] truncate">{item.card?.name}</p>
                      <p className="text-xs text-[#5a5550]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#e5b13a] shrink-0">
                      {formatPrice(item.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#2a2a38] pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a5550]">Subtotal</span>
                  <span className="text-[#a09a8e]">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a5550]">Ongkir</span>
                  <span className="text-green-400 text-xs font-medium">Dihitung setelah pesanan</span>
                </div>
                <div className="flex justify-between font-bold border-t border-[#2a2a38] pt-2 mt-2">
                  <span className="text-[#f0ece4]">Total</span>
                  <span className="text-[#e5b13a] text-lg">{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
