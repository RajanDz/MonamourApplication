import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../hooks/useSession'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const sessionId = useSession()
  const [ids, setIds] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (!sessionId) return
    supabase
      .from('wishlist')
      .select('product_id, products(*, categories(name))')
      .eq('session_id', sessionId)
      .then(({ data }) => {
        const rows = data || []
        setIds(rows.map(r => r.product_id))
        setProducts(rows.map(r => r.products).filter(Boolean))
      })
  }, [sessionId])

  const isInWishlist = useCallback((id) => ids.includes(id), [ids])

  const toggle = useCallback(async (product) => {
    if (!sessionId) return
    const { id } = product

    if (ids.includes(id)) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('session_id', sessionId)
        .eq('product_id', id)
      if (!error) {
        setIds(prev => prev.filter(x => x !== id))
        setProducts(prev => prev.filter(p => p.id !== id))
        toast('Uklonjeno iz liste želja', { icon: '♡' })
      }
    } else {
      const { error } = await supabase
        .from('wishlist')
        .upsert({ session_id: sessionId, product_id: id }, { onConflict: 'session_id,product_id', ignoreDuplicates: true })
      if (!error) {
        setIds(prev => [...prev, id])
        setProducts(prev => [...prev, product])
        toast.success('Dodano u listu želja')
      }
    }
  }, [sessionId, ids])

  return (
    <WishlistContext.Provider value={{ ids, products, isInWishlist, toggle, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
