import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'

export default function Home() {
  const [banners, setBanners] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const [{ data: bannersData }, { data: catsData }, { data: prodData }] = await Promise.all([
        supabase.from('banners').select('*').eq('is_active', true).order('order_index'),
        supabase.from('categories').select('*').eq('is_active', true).limit(4),
        supabase.from('products')
          .select('*, categories(name)')
          .eq('is_featured', true)
          .eq('is_active', true)
          .limit(8),
      ])
      setBanners(bannersData || [])
      setCategories(catsData || [])
      setFeatured(prodData || [])
      setLoading(false)
    }
    load()

    supabase.from('page_views').insert({ page: '/', user_agent: navigator.userAgent })
  }, [])

  useEffect(() => {
    if (banners.length < 2) return
    const t = setInterval(() => setCurrentBanner(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners.length])

  const banner = banners[currentBanner]

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className={`hero${!banner?.image ? ' hero-placeholder' : ''}`}>
          {banner?.image && <img src={banner.image} alt={banner.title || 'Mon Amour'} />}
          <div className="hero-content">
            <p className="hero-eyebrow">New Collection</p>
            <h1 className="hero-title">{banner?.title || 'Timeless Luxury'}</h1>
            <p className="hero-subtitle">{banner?.subtitle || 'Curated pieces for the modern woman.'}</p>
            <button
              className="btn btn-gold"
              onClick={() => navigate(banner?.link || '/products')}
            >
              Explore Collection
            </button>
          </div>
          {banners.length > 1 && (
            <div style={{ position: 'absolute', bottom: 24, right: 24, display: 'flex', gap: 6 }}>
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  style={{
                    width: i === currentBanner ? 20 : 6, height: 6,
                    background: i === currentBanner ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                    border: 'none', cursor: 'pointer', borderRadius: 3, transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="section-sm">
            <div className="container">
              <div className="section-header">
                <p className="section-eyebrow">Browse by</p>
                <h2 className="section-title">Our Collections</h2>
              </div>
              <div className="category-grid">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`category-card${!cat.image ? ' category-card-placeholder' : ''}`}
                    onClick={() => navigate(`/products?category=${cat.id}`)}
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} loading="lazy" />
                    ) : (
                      <div className="category-card-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', fontSize: '2rem' }}>◇</div>
                    )}
                    <div className="category-card-overlay">
                      <span className="category-card-name">{cat.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="section" style={{ background: 'var(--cream)' }}>
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Handpicked</p>
              <h2 className="section-title">Featured Pieces</h2>
              <p className="section-subtitle">Carefully selected items that embody elegance and craftsmanship.</p>
            </div>
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : featured.length > 0 ? (
              <div className="product-grid">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">◇</div>
                <h3>Coming Soon</h3>
                <p>Our curated collection is being prepared.</p>
              </div>
            )}
            {featured.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <button className="btn btn-outline" onClick={() => navigate('/products')}>
                  View All Products
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Brand Strip */}
        <section className="section-sm" style={{ background: 'var(--black)', color: 'white', textAlign: 'center' }}>
          <div className="container">
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Our Promise
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'white', marginBottom: 16 }}>
              Quality That Endures
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto', fontSize: '0.95rem' }}>
              Every piece in our collection is thoughtfully sourced and crafted to stand the test of time.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
