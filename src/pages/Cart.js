import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSession } from '../hooks/useSession'
import { supabase } from '../lib/supabase'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

function formatPrice(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p)
}

const SHIPPING = 12
const FREE_SHIPPING_THRESHOLD = 150

export default function Cart() {
  const { items, loading, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const sessionId = useSession()
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', country: '' })

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING
  const orderTotal = total + shipping

  async function handleOrder(e) {
    e.preventDefault()
    if (!sessionId || items.length === 0) return
    setSubmitting(true)

    const orderItems = items.map(item => ({
      product_id: item.product_id,
      name: item.product?.name,
      price: item.product?.sale_price || item.product?.price,
      quantity: item.quantity,
      image: item.product?.images?.[0] || null,
    }))

    const { error } = await supabase.from('orders').insert({
      session_id: sessionId,
      items: orderItems,
      total: orderTotal,
      status: 'pending',
      shipping_info: form,
    })

    if (error) {
      toast.error('Failed to place order. Please try again.')
      setSubmitting(false)
      return
    }

    await clearCart()
    toast.success('Order placed! Thank you for your purchase.')
    navigate('/')
  }

  if (loading) return (
    <>
      <AnnouncementBar /><Header />
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--gray-300)' }}>Loading...</div>
    </>
  )

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="container" style={{ paddingTop: 48, paddingBottom: 88 }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--black)' }}>Shopping Bag</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 36 }}>
            Shopping Bag {items.length > 0 && <span style={{ fontSize: '1rem', color: 'var(--gray-400)', fontFamily: 'var(--font-sans)' }}>({items.length} items)</span>}
          </h1>

          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">◻</div>
              <h3>Your bag is empty</h3>
              <p>Discover our curated collections and find your next favourite piece.</p>
              <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-layout">
              <div>
                <p className="cart-items-title">Items</p>
                {items.map(item => {
                  const price = item.product?.sale_price || item.product?.price || 0
                  return (
                    <div key={item.id} className="cart-item">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="cart-item-image" loading="lazy" />
                      ) : (
                        <div className="cart-item-image" style={{ background: 'linear-gradient(135deg, var(--gray-100), var(--cream-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)' }}>◇</div>
                      )}
                      <div>
                        <p className="cart-item-cat">{item.product?.categories?.name}</p>
                        <p className="cart-item-name">{item.product?.name}</p>
                        <p className="cart-item-price">{formatPrice(price)}</p>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                      <div className="qty-control" style={{ height: 36 }}>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 36, height: 36, fontSize: '1rem' }}>−</button>
                        <span style={{ width: 36, textAlign: 'center', fontSize: '0.875rem', borderLeft: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 36, height: 36, fontSize: '1rem' }}>+</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="cart-summary">
                <p className="cart-summary-title">Order Summary</p>
                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 12 }}>
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - total)} more for free shipping
                  </p>
                )}
                <div className="summary-total"><span>Total</span><span>{formatPrice(orderTotal)}</span></div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </button>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/products')}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Checkout</h3>
              <button className="modal-close" onClick={() => setShowCheckout(false)}>×</button>
            </div>
            <form onSubmit={handleOrder}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP / Postal Code</label>
                    <input className="form-input" required value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-input" required value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="United States" />
                </div>
                <div style={{ background: 'var(--cream)', padding: '16px', marginTop: 8 }}>
                  <div className="summary-row"><span>Order Total</span><span style={{ fontWeight: 500, color: 'var(--black)' }}>{formatPrice(orderTotal)}</span></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCheckout(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
