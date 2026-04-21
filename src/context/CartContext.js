import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../hooks/useSession'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const sessionId = useSession()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!sessionId) return
    setLoading(true)
    const { data } = await supabase
      .from('cart')
      .select('*, product:products(id, name, slug, price, sale_price, images, stock, categories(name))')
      .eq('session_id', sessionId)
    setItems(data || [])
    setLoading(false)
  }, [sessionId])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    if (!sessionId) return
    const existing = items.find(i => i.product_id === productId)
    if (existing) {
      const { data } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select('*, product:products(id, name, slug, price, sale_price, images, stock, categories(name))')
        .single()
      setItems(prev => prev.map(i => i.id === existing.id ? data : i))
    } else {
      const { data } = await supabase
        .from('cart')
        .insert({ session_id: sessionId, product_id: productId, quantity })
        .select('*, product:products(id, name, slug, price, sale_price, images, stock, categories(name))')
        .single()
      if (data) setItems(prev => [...prev, data])
    }
  }

  const removeFromCart = async (cartItemId) => {
    await supabase.from('cart').delete().eq('id', cartItemId)
    setItems(prev => prev.filter(i => i.id !== cartItemId))
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return removeFromCart(cartItemId)
    const { data } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', cartItemId)
      .select('*, product:products(id, name, slug, price, sale_price, images, stock, categories(name))')
      .single()
    if (data) setItems(prev => prev.map(i => i.id === cartItemId ? data : i))
  }

  const clearCart = async () => {
    if (!sessionId) return
    await supabase.from('cart').delete().eq('session_id', sessionId)
    setItems([])
  }

  const total = items.reduce((sum, item) => {
    const price = item.product?.sale_price || item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, total, count, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
