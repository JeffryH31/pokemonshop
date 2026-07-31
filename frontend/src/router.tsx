import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import Layout from './components/layout/Layout'
import AdminLayout from './pages/admin/AdminLayout'

// Route-level code splitting keeps storefront and admin bundles separate.
const HomePage = lazy(() => import('./pages/HomePage'))
const CardsPage = lazy(() => import('./pages/CardsPage'))
const CardDetailPage = lazy(() => import('./pages/CardDetailPage'))
const FavouritesPage = lazy(() => import('./pages/FavouritesPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCards = lazy(() => import('./pages/admin/AdminCards'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-[#2a2a38] border-t-[#e5b13a] animate-spin" />
    </div>
  )
}

const lazyRoute = (node: ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: lazyRoute(<HomePage />) },
      { path: 'cards', element: lazyRoute(<CardsPage />) },
      { path: 'cards/:id', element: lazyRoute(<CardDetailPage />) },
      { path: 'favourites', element: lazyRoute(<FavouritesPage />) },
      { path: 'about', element: lazyRoute(<AboutPage />) },
    ],
  },
  {
    path: '/admin/login',
    element: lazyRoute(<AdminLogin />),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: lazyRoute(<AdminDashboard />) },
      { path: 'cards', element: lazyRoute(<AdminCards />) },
    ],
  },
])
