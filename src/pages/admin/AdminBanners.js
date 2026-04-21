import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const emptyForm = { title: '', subtitle: '', image: '', link: '', is_active: true, order_index: 0 }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchBanners = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('banners').select('*').order('order_index')
    setBanners(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchBanners() }, [fetchBanners])

  async function handleSave() {
    if (!form.image) { toast.error('Image URL is required'); return }
    setSaving(true)

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      link: form.link || null,
      is_active: form.is_active,
      order_index: parseInt(form.order_index) || 0,
    }

    let error
    if (modal === 'add') {
      ;({ error } = await supabase.from('banners').insert(payload))
    } else {
      ;({ error } = await supabase.from('banners').update(payload).eq('id', form.id))
    }

    if (error) toast.error(error.message)
    else {
      toast.success(modal === 'add' ? 'Banner created' : 'Banner updated')
      setModal(null)
      fetchBanners()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this banner?')) return
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Banner deleted'); fetchBanners() }
  }

  async function toggleActive(banner) {
    await supabase.from('banners').update({ is_active: !banner.is_active }).eq('id', banner.id)
    fetchBanners()
  }

  return (
    <div className="page-fade">
      <div className="admin-page-title" style={{ marginBottom: 24 }}>Banners</div>

      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm({ ...emptyForm, order_index: banners.length }); setModal('add') }}>
          + Add Banner
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--gray-300)', padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : banners.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">▭</div>
          <h3>No banners yet</h3>
          <p>Add banners to showcase on your homepage hero.</p>
        </div>
      ) : (
        <div className="banners-grid">
          {banners.map(banner => (
            <div key={banner.id} className="banner-card">
              {banner.image ? (
                <img src={banner.image} alt={banner.title || 'Banner'} />
              ) : (
                <div className="banner-placeholder" style={{ width: '100%', height: '100%' }}>▭</div>
              )}
              <div className="banner-card-overlay">
                {banner.title && <div className="banner-card-title">{banner.title}</div>}
                {banner.subtitle && <div className="banner-card-sub">{banner.subtitle}</div>}
              </div>
              <div className="banner-card-actions">
                <button
                  className="btn btn-sm"
                  style={{ background: banner.is_active ? 'var(--gold)' : 'rgba(255,255,255,0.3)', color: 'white', padding: '4px 8px', fontSize: '0.65rem' }}
                  onClick={() => toggleActive(banner)}
                >
                  {banner.is_active ? 'Live' : 'Off'}
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--black)', padding: '4px 8px', fontSize: '0.65rem' }}
                  onClick={() => { setForm({ ...banner }); setModal('edit') }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(184,52,44,0.9)', color: 'white', padding: '4px 8px', fontSize: '0.65rem' }}
                  onClick={() => handleDelete(banner.id)}
                >
                  ×
                </button>
              </div>
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.65rem', padding: '2px 7px' }}>
                #{banner.order_index}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Banner' : 'Edit Banner'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Banner'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Image URL *</label>
          <input className="form-input" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
          {form.image && (
            <div style={{ marginTop: 10, aspectRatio: '16/7', overflow: 'hidden', background: 'var(--gray-100)', maxWidth: '100%' }}>
              <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Banner Headline" />
          </div>
          <div className="form-group">
            <label className="form-label">Subtitle</label>
            <input className="form-input" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Supporting text" />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Link URL</label>
            <input className="form-input" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="/products" />
          </div>
          <div className="form-group">
            <label className="form-label">Order Index</label>
            <input className="form-input" type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: e.target.value }))} />
          </div>
        </div>
        <label className="toggle-wrap">
          <label className="toggle">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            <span className="toggle-track" />
          </label>
          <span style={{ fontSize: '0.875rem' }}>Active (show on homepage)</span>
        </label>
      </Modal>
    </div>
  )
}
