import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function formatPrice(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p)
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setOrders(data || [])
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function updateStatus(orderId, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) toast.error(error.message)
    else {
      toast.success(`Order marked as ${status}`)
      fetchOrders()
      if (selected?.id === orderId) setSelected(s => ({ ...s, status }))
    }
  }

  return (
    <div className="page-fade">
      <div className="admin-page-title" style={{ marginBottom: 24 }}>Orders</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)}
            style={{ textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray-300)', padding: 32 }}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray-300)', padding: 32 }}>No orders</td></tr>
              ) : orders.map(order => (
                <tr key={order.id}>
                  <td data-label="Order" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{order.id.slice(0, 8)}</td>
                  <td data-label="Kupac">
                    <div style={{ fontWeight: 500 }}>{order.shipping_info?.name || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{order.shipping_info?.email}</div>
                  </td>
                  <td data-label="Stavke">{Array.isArray(order.items) ? order.items.length : '—'}</td>
                  <td data-label="Ukupno" style={{ fontWeight: 500 }}>{formatPrice(order.total)}</td>
                  <td data-label="Status"><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                  <td data-label="Datum">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td data-label="">
                    <div className="table-actions">
                      <button className="tbl-btn edit" onClick={() => setSelected(order)}>View</button>
                      <select
                        className="tbl-select"
                        style={{ fontSize: '0.72rem', padding: '5px 8px', border: '1px solid var(--gray-200)', cursor: 'pointer', outline: 'none' }}
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Order #${selected?.id?.slice(0, 8)}`}
      >
        {selected && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <p className="form-label">Customer</p>
              <p style={{ fontWeight: 500 }}>{selected.shipping_info?.name}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{selected.shipping_info?.email}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: 4 }}>
                {selected.shipping_info?.address}, {selected.shipping_info?.city}, {selected.shipping_info?.zip}, {selected.shipping_info?.country}
              </p>
            </div>
            <div style={{ marginBottom: 24 }}>
              <p className="form-label" style={{ marginBottom: 12 }}>Items</p>
              {(Array.isArray(selected.items) ? selected.items : []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {item.image && <img src={item.image} alt="" style={{ width: 40, height: 52, objectFit: 'cover', background: 'var(--gray-100)' }} />}
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, padding: '12px 0' }}>
              <span>Total</span>
              <span>{formatPrice(selected.total)}</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <p className="form-label" style={{ marginBottom: 8 }}>Update Status</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className={`btn btn-sm ${selected.status === s ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => updateStatus(selected.id, s)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
