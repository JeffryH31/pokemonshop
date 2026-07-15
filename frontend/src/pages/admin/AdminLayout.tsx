import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { LayoutDashboard, Layers, ShoppingBag, Package, LogOut, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'

const NAV = [
  { to: '/admin', icon: <LayoutDashboard size={16} />, label: 'Dashboard', end: true },
  { to: '/admin/cards', icon: <Layers size={16} />, label: 'Cards' },
  { to: '/admin/sets', icon: <Package size={16} />, label: 'Sets' },
  { to: '/admin/orders', icon: <ShoppingBag size={16} />, label: 'Orders' },
]

export default function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuthStore()
  const { mutate: logout } = useLogout()

  if (!isAuthenticated) return <Navigate to="/login" />
  if (!isAdmin) return <Navigate to="/" />

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#111118] border-r border-[#2a2a38] flex flex-col">
        <div className="px-5 py-5 border-b border-[#2a2a38]">
          <p className="text-xs text-[#5a5550] uppercase tracking-widest font-semibold">Admin Panel</p>
          <p className="text-sm font-bold text-[#e5b13a] font-display mt-0.5">PokéShop</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
            Back to Shop
          </NavLink>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
