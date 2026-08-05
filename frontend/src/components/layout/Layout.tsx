import { Outlet, ScrollRestoration } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import WhatsAppPopup from '../WhatsAppPopup'
import WhatsAppFAB from '../WhatsAppFAB'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ScrollRestoration getKey={(location) => location.pathname} />
      {/* WhatsApp — always visible */}
      <WhatsAppFAB />
      <WhatsAppPopup />
    </div>
  )
}
