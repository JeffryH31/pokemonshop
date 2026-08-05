import { useState } from 'react'
import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Layers, LogOut, ArrowLeft, Menu, X } from 'lucide-react'
import { useAuthStore, selectIsAuthenticated, selectIsAdmin } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'

const NAV = [
  { to: '/admin', icon: <LayoutDashboard size={16} />, label: 'Dashboard', end: true },
  { to: '/admin/cards', icon: <Layers size={16} />, label: 'Produk' },
]

export default function AdminLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isAdmin = useAuthStore(selectIsAdmin)
  const { mutate: logout } = useLogout()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-[#2a2a38] flex items-center justify-between">
        <div>
          <p className="text-xs text-[#5a5550] uppercase tracking-widest font-semibold">Panel Admin</p>
          <p className="text-sm font-bold text-[#e5b13a] font-display mt-0.5">Wonderplays</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-[#5a5550] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-[#e5b13a] text-[#0a0a0f] font-semibold'
                  : 'text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28]'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[#2a2a38] space-y-0.5">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all"
        >
          <ArrowLeft size={14} />
          Kembali ke Toko
        </NavLink>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all w-full cursor-pointer"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">

      {/* Desktop sidebar — statis */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-[#111118] border-r border-[#2a2a38] flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar — drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#111118] border-r border-[#2a2a38] flex flex-col z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Konten */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-[#111118] border-b border-[#2a2a38]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-[#a09a8e] hover:text-[#f0ece4] hover:bg-[#1c1c28] transition-all cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-[#e5b13a] font-display">Wonderplays Admin</span>
        </div>

        <div className="p-4 sm:p-6 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
