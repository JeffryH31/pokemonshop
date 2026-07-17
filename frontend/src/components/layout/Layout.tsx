import { Outlet } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import WhatsAppPopup from '../WhatsAppPopup'
import WhatsAppFAB from '../WhatsAppFAB'
import { useCart } from '../../hooks/useCart'
import { useAuthStore } from '../../store/authStore'

export default function Layout() {
  const { isAuthenticated } = useAuthStore()
  // Prefetch cart when authenticated
  useCart()

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      <Footer />
      {isAuthenticated && <CartDrawer />}
      {/* WhatsApp — always visible */}
      <WhatsAppFAB />
      <WhatsAppPopup />
    </div>
  )
}
