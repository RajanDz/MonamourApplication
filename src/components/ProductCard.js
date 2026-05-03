import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../hooks/useSession'
import toast from 'react-hot-toast'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const sessionId = useSession()
  const [imgIndex, setImgIndex] = useState(0)
  const touchStartX = useRef(null)
  const mouseStartX = useRef(null)
  const didSwipe = useRef(false)

  const images = product.images || []
  const image = images[imgIndex] || images[0]
  const isOnSale = product.sale_price && product.sale_price < product.price

  function onSwipe(delta) {
    if (Math.abs(delta) < 40) return
    didSwipe.current = true
    if (delta < 0 && imgIndex < images.length - 1) setImgIndex(i => i + 1)
    else if (delta > 0 && imgIndex > 0) setImgIndex(i => i - 1)
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    didSwipe.current = false
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    onSwipe(e.changedTouches[0].clientX - touchStartX.current)
    touchStartX.current = null
  }

  function handleMouseDown(e) {
    mouseStartX.current = e.clientX
    didSwipe.current = false
  }

  function handleMouseUp(e) {
    if (mouseStartX.current === null) return
    onSwipe(e.clientX - mouseStartX.current)
    mouseStartX.current = null
  }

  async function handleWishlist(e) {
    e.stopPropagation()
    if (!sessionId) return
    const { error } = await supabase.from('wishlist').upsert(
      { session_id: sessionId, product_id: product.id },
      { onConflict: 'session_id,product_id', ignoreDuplicates: true }
    )
    if (!error) toast.success('Saved to wishlist')
  }

  async function handleClick() {
    if (didSwipe.current) return
    await supabase.from('product_clicks').insert({
      product_id: product.id,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    })
    navigate(`/products/${product.slug}`)
  }

  return (
    <div className="product-card" onClick={handleClick}>
      <div
        className="product-card-image-wrap"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {image ? (
          <img
            key={imgIndex}
            src={image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="product-card-placeholder">◇</div>
        )}

        <div className="product-card-badges">
          {isOnSale && <span className="badge-sale">Sale</span>}
          {product.is_featured && <span className="badge-featured">Featured</span>}
        </div>

        {images.length > 1 && (
          <div className="product-card-dots">
            {images.map((_, i) => (
              <span key={i} className={`product-card-dot${i === imgIndex ? ' active' : ''}`} />
            ))}
          </div>
        )}

        <div className="product-card-actions">
          <button className="btn btn-primary btn-sm" onClick={handleWishlist} style={{ flex: 1 }}>
            ♡ Wishlist
          </button>
        </div>
      </div>

      <div className="product-card-info">
        {product.categories?.name && (
          <div className="product-card-category">{product.categories.name}</div>
        )}
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">
          <span className={`price-current${isOnSale ? ' price-sale' : ''}`}>
            {formatPrice(isOnSale ? product.sale_price : product.price)}
          </span>
          {isOnSale && (
            <span className="price-original">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
