import { Link } from 'react-router-dom'
import { Package, Shield, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#2a2a38] mt-auto">
      {/* Trust badges */}
      <div className="border-b border-[#1e1e2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Package size={20} className="text-[#e5b13a]" />,
                title: 'Fast Delivery',
                desc: 'Orders shipped same day before 2PM',
              },
              {
                icon: <Shield size={20} className="text-[#e5b13a]" />,
                title: 'Secure Checkout',
                desc: 'Your payment data is always protected',
              },
              {
                icon: <Zap size={20} className="text-[#e5b13a]" />,
                title: 'Authentic Cards',
                desc: '100% genuine Pokémon TCG products',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e5b13a11] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ece4]">{item.title}</p>
                  <p className="text-xs text-[#5a5550] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#e5b13a] flex items-center justify-center">
                <span className="text-[#0a0a0f] font-bold text-xs font-display">P</span>
              </div>
              <span className="font-display font-bold text-[#f0ece4]">PokéShop</span>
            </div>
            <p className="text-xs text-[#5a5550] leading-relaxed">
              Your trusted source for authentic Pokémon TCG singles and sealed products.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#a09a8e] uppercase tracking-widest mb-3">Shop</h4>
            <ul className="space-y-2">
              {[
                { to: '/cards', label: 'All Cards' },
                { to: '/cards?rarity=Secret+Rare', label: 'Secret Rares' },
                { to: '/cards?rarity=Ultra+Rare', label: 'Ultra Rares' },
                { to: '/cards?sort=newest', label: 'New Arrivals' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#5a5550] hover:text-[#a09a8e] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#a09a8e] uppercase tracking-widest mb-3">Account</h4>
            <ul className="space-y-2">
              {[
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Create Account' },
                { to: '/orders', label: 'My Orders' },
                { to: '/profile', label: 'Profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#5a5550] hover:text-[#a09a8e] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#a09a8e] uppercase tracking-widest mb-3">Support</h4>
            <ul className="space-y-2">
              {[
                'Shipping Policy',
                'Return Policy',
                'Privacy Policy',
                'Contact Us',
              ].map((label) => (
                <li key={label}>
                  <span className="text-sm text-[#5a5550] cursor-not-allowed">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e1e2a] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5a5550]">© {new Date().getFullYear()} PokéShop. All rights reserved.</p>
          <p className="text-xs text-[#5a5550]">Pokémon is a trademark of Nintendo / Creatures Inc. / GAME FREAK inc.</p>
        </div>
      </div>
    </footer>
  )
}
