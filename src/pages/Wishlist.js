import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../hooks/useSession'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

function formatPrice(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p)
}

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const sessionId = useSession()
  const navigate = useNavigate()

  const fetchWishlist = useCallback(async () => {
    if (!sessionId) return
    setLoading(true)
    const { data } = await supabase
      .from('wishlist')
      .select('*, product:products(id, name, slug, price, sale_price, images, categories(name))')
      .eq('session_id', sessionId)
      .order('added_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }, [sessionId])

  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  async function handleRemove(itemId) {
    await supabase.from('wishlist').delete().eq('id', itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
    toast.success('Removed from wishlist')
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="container" style={{ paddingTop: 48, paddingBottom: 88 }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--black)' }}>Wishlist</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 36 }}>
            My Wishlist
          </h1>

          {loading ? (
            <div style={{ color: 'var(--gray-300)', textAlign: 'center', padding: '80px 0' }}>Loading...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">♡</div>
              <h3>Your wishlist is empty</h3>
              <p>Save your favourite pieces to come back to them later.</p>
              <button className="btn btn-primary" onClick={() => navigate('/products')}>Explore Collection</button>
            </div>
          ) : (
            <div className="product-grid">
              {items.map(item => {
                const p = item.product
                if (!p) return null
                const isOnSale = p.sale_price && p.sale_price < p.price
                const image = p.images?.[0]
                return (
                  <div key={item.id} className="wishlist-card-wrap">
                    <div className="product-card" onClick={() => navigate(`/products/${p.slug}`)}>
                      <div className="product-card-image-wrap">
                        {image ? (
                          <img src={image} alt={p.name} className="product-card-image" loading="lazy" />
                        ) : (
                          <div className="product-card-placeholder">◇</div>
                        )}
                        <div className="product-card-actions">
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1 }}
                            onClick={e => { e.stopPropagation(); navigate(`/products/${p.slug}`) }}
                          >
                            Pogledaj
                          </button>
                        </div>
                      </div>
                      <div className="product-card-info">
                        {p.categories?.name && <div className="product-card-category">{p.categories.name}</div>}
                        <div className="product-card-name">{p.name}</div>
                        <div className="product-card-price">
                          <span className={`price-current${isOnSale ? ' price-sale' : ''}`}>
                            {formatPrice(isOnSale ? p.sale_price : p.price)}
                          </span>
                          {isOnSale && <span className="price-original">{formatPrice(p.price)}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => handleRemove(item.id)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
