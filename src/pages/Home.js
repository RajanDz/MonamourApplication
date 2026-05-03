import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'

const PAGE_SIZE = 12

export default function Home() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, count } = await supabase
        .from('products')
        .select('*, categories(name)', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to)

      setProducts(data || [])
      setTotal(count || 0)
      setLoading(false)
    }
    load()
  }, [page])

  useEffect(() => {
    supabase.from('page_views').insert({ page: '/', user_agent: navigator.userAgent })
  }, [])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goTo(p) {
    setPage(p)
    scrollTop()
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          {loading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 56 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => goTo(page - 1)}
                    disabled={page === 1}
                    style={{ minWidth: 40, padding: '8px 14px', opacity: page === 1 ? 0.4 : 1 }}
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => goTo(p)}
                      style={{
                        minWidth: 36, height: 36, border: 'none', cursor: 'pointer',
                        background: p === page ? 'var(--gold)' : 'transparent',
                        color: p === page ? 'var(--black)' : 'var(--gray-400)',
                        fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                        fontWeight: p === page ? 600 : 400,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    className="btn btn-outline"
                    onClick={() => goTo(page + 1)}
                    disabled={page === totalPages}
                    style={{ minWidth: 40, padding: '8px 14px', opacity: page === totalPages ? 0.4 : 1 }}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◇</div>
              <h3>Coming Soon</h3>
              <p>Our curated collection is being prepared.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
