import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../hooks/useSession'
import toast from 'react-hot-toast'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const sessionId = useSession()

  const image = product.images?.[0]
  const isOnSale = product.sale_price && product.sale_price < product.price

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
    await supabase.from('product_clicks').insert({
      product_id: product.id,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    })
    navigate(`/products/${product.slug}`)
  }

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card-image-wrap">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
        ) : (
          <div className="product-card-placeholder">◇</div>
        )}

        <div className="product-card-badges">
          {isOnSale && <span className="badge-sale">Sale</span>}
          {product.is_featured && <span className="badge-featured">Featured</span>}
        </div>

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
