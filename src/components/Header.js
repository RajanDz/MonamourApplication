import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">Monamour</Link>

        <nav className={`header-nav${menuOpen ? ' open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className={isActive('/products')} onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/search" className={isActive('/search')} onClick={() => setMenuOpen(false)}>Search</Link>
        </nav>

        <div className="header-actions">
          <button className="header-icon-btn" onClick={() => navigate('/search')} aria-label="Search">
            <SearchIcon />
          </button>
          <button className="header-icon-btn" onClick={() => navigate('/wishlist')} aria-label="Wishlist">
            <HeartIcon />
          </button>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
