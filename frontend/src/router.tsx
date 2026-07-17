import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './pages/admin/AdminLayout'
import HomePage from './pages/HomePage'
import CardsPage from './pages/CardsPage'
import CardDetailPage from './pages/CardDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCards from './pages/admin/AdminCards'
import AdminSets from './pages/admin/AdminSets'
import AdminOrders from './pages/admin/AdminOrders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'cards', element: <CardsPage /> },
      { path: 'cards/:id', element: <CardDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'cards', element: <AdminCards /> },
      { path: 'sets', element: <AdminSets /> },
      { path: 'orders', element: <AdminOrders /> },
    ],
  },
])
