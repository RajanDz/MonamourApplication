import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Mon Amour</h3>
            <p>Curated luxury fashion for the modern woman. Every piece is chosen with intention, crafted with care.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products">All Collections</Link></li>
              <li><Link to="/products?featured=true">New Arrivals</Link></li>
              <li><Link to="/products?sale=true">Sale</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/shipping">Dostava</Link></li>
              <li><Link to="/returns">Povrat</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <ul>
              <li><Link to="/about">O nama</Link></li>
              <li><Link to="/shipping">Politika dostave</Link></li>
              <li><Link to="/returns">Povrat i zamjena</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Mon Amour. All rights reserved.</span>
          <span style={{ color: 'var(--gold)' }}>Luxury Fashion</span>
        </div>
      </div>
    </footer>
  )
}
