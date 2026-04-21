import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function formatPrice(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p)
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{status}</span>
}

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, views: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: orderCount },
        { data: revenueData },
        { count: productCount },
        { count: viewCount },
        { data: orders },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
      ])

      const revenue = (revenueData || []).reduce((sum, o) => sum + (o.total || 0), 0)

      setStats({
        orders: orderCount || 0,
        revenue,
        products: productCount || 0,
        views: viewCount || 0,
      })
      setRecentOrders(orders || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ color: 'var(--gray-300)', padding: 40 }}>Loading...</div>

  return (
    <div className="page-fade">
      <div className="admin-page-title" style={{ marginBottom: 24 }}>Dashboard</div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-label">Total Orders</div>
          <div className="stat-card-value">{stats.orders}</div>
          <div className="stat-card-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Revenue</div>
          <div className="stat-card-value">{formatPrice(stats.revenue)}</div>
          <div className="stat-card-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Products</div>
          <div className="stat-card-value">{stats.products}</div>
          <div className="stat-card-sub">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Page Views</div>
          <div className="stat-card-value">{stats.views.toLocaleString()}</div>
          <div className="stat-card-sub">All time</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--gray-300)' }}>No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td data-label="Order" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{order.id.slice(0, 8)}</td>
                    <td data-label="Customer">{order.shipping_info?.name || '—'}</td>
                    <td data-label="Items">{Array.isArray(order.items) ? order.items.length : '—'}</td>
                    <td data-label="Total">{formatPrice(order.total)}</td>
                    <td data-label="Status"><StatusBadge status={order.status} /></td>
                    <td data-label="Date">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
