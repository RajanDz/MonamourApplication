import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSettings from './pages/admin/AdminSettings'

// Layout route — no path. Checks auth, renders Outlet if ok.
function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#1c1118',
        color: '#c9a96e', fontFamily: 'Georgia, serif', fontSize: '1.5rem',
        letterSpacing: '0.1em',
      }}>
        Mon Amour
      </div>
    )
  }

  if (!user) return <Navigate to="/admin" replace />
  return <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', borderRadius: '2px' },
              success: { iconTheme: { primary: '#c9a96e', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* ── Customer ── */}
            <Route path="/" element={<Home />} />
            <Route path="/products/:slug" element={<ProductDetail />} />

            {/* ── Admin login (public, exact /admin) ── */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* ── Protected admin pages — full absolute paths ── */}
            <Route element={<RequireAuth />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
