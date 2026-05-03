import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin/dashboard', icon: '◈', label: 'Dashboard' },
  { to: '/admin/products', icon: '◇', label: 'Products' },
  { to: '/admin/categories', icon: '❑', label: 'Categories' },
  { to: '/admin/orders', icon: '◻', label: 'Orders' },
  { to: '/admin/settings', icon: '⚙', label: 'Settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out')
    navigate('/admin')
  }

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-logo">
          <h2>Mon Amour</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'rgba(255,255,255,0.4)', padding: '6px 0', fontSize: '0.72rem', letterSpacing: '0.1em' }}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="admin-content">
        <div className="admin-topbar">
          <button
            className="mobile-menu-btn admin-hamburger"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <span className="admin-topbar-brand">Mon Amour</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }} className="admin-topbar-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
