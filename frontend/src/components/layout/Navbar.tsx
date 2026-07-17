import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, User, Menu, X, LogOut, Package, Settings, ChevronDown, Clock } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useLogout } from '../../hooks/useAuth'
import { useSearchCards } from '../../hooks/useCatalog'
import { useDebounce } from '../../hooks/useDebounce'
import { formatPrice } from '../../lib/utils'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin } = useAuthStore()
  const { itemCount, openCart } = useCartStore()
  const { mutate: logout } = useLogout()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)
  const { data: searchResults } = useSearchCards(debouncedQuery)
  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery('')
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchSelect = (id: number) => {
    navigate(`/cards/${id}`)
    setSearchOpen(false)
    setSearchQuery('')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#2a2a38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#e5b13a] flex items-center justify-center shadow-md shadow-[#e5b13a33]">
              <span className="text-[#0a0a0f] font-bold text-sm font-display">W</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-[#f0ece4] tracking-wide leading-none">
                Wonderplays
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={9} className="text-[#e5b13a]" />
                <span className="text-[9px] text-[#5a5550] font-medium tracking-wide">12.00 – 24.00 WIB</span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Beranda', end: true },
              { to: '/cards', label: 'Toko', end: false },
              { to: '/about', label: 'Tentang Kami', end: true },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-[#f0ece4] bg-[#1c1c28] font-medium'
                      : 'text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                to="/orders"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-[#f0ece4] bg-[#1c1c28] font-medium'
                      : 'text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28]'
                  }`
                }
              >
                Pesanan
              </NavLink>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all"
                aria-label="Cari"
              >
                <Search size={18} />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-[#16161f] border border-[#2a2a38] rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-[#2a2a38]">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Cari kartu Pokémon..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-sm text-[#f0ece4] placeholder-[#5a5550] outline-none"
                      />
                    </div>
                    {searchResults && searchResults.length > 0 && (
                      <ul className="max-h-72 overflow-y-auto divide-y divide-[#2a2a38]">
                        {searchResults.slice(0, 8).map((card) => (
                          <li key={card.id}>
                            <button
                              onClick={() => handleSearchSelect(card.id)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-[#1c1c28] transition-colors text-left"
                            >
                              {card.image_url ? (
                                <img src={card.image_url} alt={card.name} className="w-8 h-10 object-cover rounded" />
                              ) : (
                                <div className="w-8 h-10 bg-[#2a2a38] rounded flex items-center justify-center text-[#5a5550] text-xs">W</div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#f0ece4] truncate">{card.name}</p>
                                <p className="text-xs text-[#5a5550]">{card.set?.name ?? 'Set Tidak Diketahui'}</p>
                              </div>
                              <span className="text-xs text-[#e5b13a] font-semibold shrink-0">{formatPrice(card.price)}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {debouncedQuery.length >= 2 && (!searchResults || searchResults.length === 0) && (
                      <p className="text-xs text-[#5a5550] text-center py-6">Kartu tidak ditemukan</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            {isAuthenticated && (
              <button
                onClick={openCart}
                className="relative p-2 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all"
                aria-label="Keranjang"
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#e5b13a] text-[#0a0a0f] text-[10px] font-bold flex items-center justify-center px-1"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#e5b13a22] border border-[#e5b13a44] flex items-center justify-center">
                    <span className="text-[#e5b13a] text-xs font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#16161f] border border-[#2a2a38] rounded-xl shadow-2xl overflow-hidden py-1"
                    >
                      <div className="px-4 py-2.5 border-b border-[#2a2a38]">
                        <p className="text-sm font-semibold text-[#f0ece4] truncate">{user?.name}</p>
                        <p className="text-xs text-[#5a5550] truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-colors">
                        <User size={14} />Profil Saya
                      </Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-colors">
                        <Package size={14} />Pesanan Saya
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e5b13a] hover:bg-[#e5b13a11] transition-colors">
                          <Settings size={14} />Panel Admin
                        </Link>
                      )}
                      <div className="border-t border-[#2a2a38] mt-1">
                        <button onClick={() => { setUserMenuOpen(false); logout() }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full">
                          <LogOut size={14} />Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link to="/login" className="text-sm text-[#a09a8e] hover:text-[#f0ece4] transition-colors px-3 py-2">
                  Masuk
                </Link>
                <Link to="/register" className="text-sm bg-[#e5b13a] text-[#0a0a0f] hover:bg-[#f0c547] font-semibold px-4 py-2 rounded-lg transition-colors">
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#2a2a38] bg-[#0a0a0f] overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {[
                { to: '/', label: 'Beranda', end: true },
                { to: '/cards', label: 'Toko', end: false },
                { to: '/about', label: 'Tentang Kami', end: true },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#f0ece4] bg-[#1c1c28] font-medium'
                        : 'text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {isAuthenticated && (
                <NavLink
                  to="/orders"
                  end
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#f0ece4] bg-[#1c1c28] font-medium'
                        : 'text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28]'
                    }`
                  }
                >
                  Pesanan
                </NavLink>
              )}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2 border-t border-[#2a2a38] mt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm text-[#a09a8e] border border-[#2a2a38] hover:border-[#e5b13a44] hover:text-[#f0ece4] py-2 rounded-lg transition-colors">Masuk</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm bg-[#e5b13a] text-[#0a0a0f] font-semibold py-2 rounded-lg hover:bg-[#f0c547] transition-colors">Daftar</Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
