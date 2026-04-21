import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)

    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(24)

    setResults(data || [])
    setLoading(false)

    await supabase.from('search_logs').insert({ search_term: q, results_count: data?.length || 0 })
  }, [])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    if (q) { setQuery(q); doSearch(q) }
  }, [searchParams, doSearch])

  function handleSubmit(e) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query.trim()) p.set('q', query.trim())
    setSearchParams(p)
    doSearch(query.trim())
  }

  useEffect(() => {
    supabase.from('page_views').insert({ page: '/search', user_agent: navigator.userAgent })
  }, [])

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="container" style={{ paddingTop: 56, paddingBottom: 88 }}>
          <form onSubmit={handleSubmit}>
            <div className="search-bar-wrap">
              <input
                type="text"
                className="search-input-large"
                placeholder="Search for pieces..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              <span style={{ fontSize: '1.5rem', color: 'var(--gray-300)' }}>⌕</span>
            </div>
          </form>

          {loading && (
            <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '40px 0' }}>Searching...</p>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">⌕</div>
              <h3>No results found</h3>
              <p>Try different keywords or browse our collections.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: 32 }}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{searchParams.get('q')}"
              </p>
              <div className="product-grid">
                {results.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}

          {!searched && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--gray-300)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                Discover something beautiful
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
