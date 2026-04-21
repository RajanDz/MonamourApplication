import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const selectedCategory = searchParams.get('category') || ''
  const sortBy = searchParams.get('sort') || 'created_at_desc'
  const minPrice = searchParams.get('min') || ''
  const maxPrice = searchParams.get('max') || ''
  const onSale = searchParams.get('sale') === 'true'

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
  }

  useEffect(() => {
    supabase.from('categories').select('*').eq('is_active', true).then(({ data }) => setCategories(data || []))
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)

    let q = supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)

    if (selectedCategory) q = q.eq('category_id', selectedCategory)
    if (minPrice) q = q.gte('price', parseFloat(minPrice))
    if (maxPrice) q = q.lte('price', parseFloat(maxPrice))
    if (onSale) q = q.not('sale_price', 'is', null)

    if (sortBy === 'price_asc') q = q.order('price', { ascending: true })
    else if (sortBy === 'price_desc') q = q.order('price', { ascending: false })
    else if (sortBy === 'name_asc') q = q.order('name', { ascending: true })
    else q = q.order('created_at', { ascending: false })

    const { data } = await q
    setProducts(data || [])
    setLoading(false)

    if (selectedCategory) {
      supabase.from('filter_logs').insert({ filter_type: 'category', filter_value: selectedCategory })
    }
  }, [selectedCategory, sortBy, minPrice, maxPrice, onSale])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    supabase.from('page_views').insert({ page: '/products', user_agent: navigator.userAgent })
  }, [])

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 6 }}>All Collections</h1>
            <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{products.length} pieces</p>
          </div>

          <div className="products-layout">
            {/* Filters */}
            <aside className="filters-sidebar">
              <div className="filter-section">
                <h4>Categories</h4>
                <div
                  className={`filter-option${!selectedCategory ? ' active' : ''}`}
                  onClick={() => setParam('category', '')}
                >
                  <div className={`filter-checkbox${!selectedCategory ? ' checked' : ''}`} />
                  All
                </div>
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`filter-option${selectedCategory === cat.id ? ' active' : ''}`}
                    onClick={() => setParam('category', cat.id)}
                  >
                    <div className={`filter-checkbox${selectedCategory === cat.id ? ' checked' : ''}`} />
                    {cat.name}
                  </div>
                ))}
              </div>

              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    className="price-range-input"
                    value={minPrice}
                    onChange={e => setParam('min', e.target.value)}
                  />
                  <span style={{ color: 'var(--gray-300)', fontSize: '0.8rem' }}>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="price-range-input"
                    value={maxPrice}
                    onChange={e => setParam('max', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-section">
                <h4>Offers</h4>
                <div
                  className={`filter-option${onSale ? ' active' : ''}`}
                  onClick={() => setParam('sale', onSale ? '' : 'true')}
                >
                  <div className={`filter-checkbox${onSale ? ' checked' : ''}`} />
                  On Sale
                </div>
              </div>
            </aside>

            {/* Products */}
            <div>
              <div className="sort-bar">
                <span className="sort-label">{loading ? 'Loading...' : `${products.length} results`}</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={e => setParam('sort', e.target.value)}
                >
                  <option value="created_at_desc">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A–Z</option>
                </select>
              </div>

              {loading ? (
                <ProductGridSkeleton count={8} />
              ) : products.length > 0 ? (
                <div className="product-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">◇</div>
                  <h3>No Products Found</h3>
                  <p>Try adjusting your filters.</p>
                  <button className="btn btn-outline" onClick={() => setSearchParams({})}>Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
