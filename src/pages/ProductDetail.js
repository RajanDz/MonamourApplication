import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

function formatPrice(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p)
}

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (!data) { navigate('/404'); return }
      setProduct(data)
      setActiveImage(0)
      setLoading(false)

      supabase.from('page_views').insert({ page: `/products/${slug}`, user_agent: navigator.userAgent })

      if (data.category_id) {
        supabase
          .from('products')
          .select('*, categories(name)')
          .eq('category_id', data.category_id)
          .eq('is_active', true)
          .neq('id', data.id)
          .limit(4)
          .then(({ data: rel }) => setRelated(rel || []))
      }
    }
    load()
  }, [slug, navigate])

  if (loading) return (
    <>
      <AnnouncementBar /><Header />
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--gray-300)' }}>
        Loading...
      </div>
    </>
  )

  if (!product) return null

  const images = product.images?.length > 0 ? product.images : []
  const isOnSale = product.sale_price && product.sale_price < product.price
  const stockStatus = product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : 'available'

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="product-detail page-fade">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            {product.categories?.name && <><span>{product.categories.name}</span><span>/</span></>}
            <span style={{ color: 'var(--black)' }}>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            {/* Gallery */}
            <div>
              <div className="product-gallery-main">
                {images.length > 0 ? (
                  <img src={images[activeImage]} alt={product.name} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--gray-100), var(--cream-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--gray-300)' }}>◇</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="product-gallery-thumbs">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={`gallery-thumb${activeImage === i ? ' active' : ''}`}
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-detail-info">
              {product.categories?.name && (
                <div className="product-detail-category">{product.categories.name}</div>
              )}
              <h1 className="product-detail-name">{product.name}</h1>

              <div className="product-detail-price">
                <span className={`price-large${isOnSale ? ' price-sale' : ''}`}>
                  {formatPrice(isOnSale ? product.sale_price : product.price)}
                </span>
                {isOnSale && (
                  <span className="price-original" style={{ fontSize: '1.1rem' }}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="product-detail-description">{product.description}</p>
              )}

              <div className={`stock-label stock-${stockStatus}`}>
                {stockStatus === 'out' && '✕ Out of Stock'}
                {stockStatus === 'low' && `⚡ Only ${product.stock} left`}
                {stockStatus === 'available' && `✓ In Stock (${product.stock} available)`}
              </div>

              {product.instagram_link && (
                <a
                  href={product.instagram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
                  </svg>
                  Naruči putem Instagrama
                </a>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="container related-section">
            <div className="section-header">
              <p className="section-eyebrow">You may also like</p>
              <h2 className="section-title">Related Pieces</h2>
            </div>
            <div className="product-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
