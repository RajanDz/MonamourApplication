import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const emptyForm = { name: '', slug: '', description: '', image: '', is_active: true }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [productCounts, setProductCounts] = useState({})

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)

    if (data?.length) {
      const counts = {}
      await Promise.all(data.map(async cat => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)
        counts[cat.id] = count || 0
      }))
      setProductCounts(counts)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  function setField(key, value) {
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === 'name' && modal === 'add') next.slug = slugify(value)
      return next
    })
  }

  async function handleSave() {
    if (!form.name) { toast.error('Name is required'); return }
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      image: form.image || null,
      is_active: form.is_active,
    }

    let error
    if (modal === 'add') {
      ;({ error } = await supabase.from('categories').insert(payload))
    } else {
      ;({ error } = await supabase.from('categories').update(payload).eq('id', form.id))
    }

    if (error) toast.error(error.message)
    else {
      toast.success(modal === 'add' ? 'Category created' : 'Category updated')
      setModal(null)
      fetchCategories()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category? Products in it will become uncategorized.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Category deleted'); fetchCategories() }
  }

  async function toggleActive(cat) {
    await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id)
    fetchCategories()
  }

  return (
    <div className="page-fade">
      <div className="admin-page-title" style={{ marginBottom: 24 }}>Categories</div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>{categories.length} categories</h3>
          <button className="btn btn-primary btn-sm" onClick={() => { setForm(emptyForm); setModal('add') }}>
            + Add Category
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-300)', padding: 32 }}>Loading...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-300)', padding: 32 }}>No categories yet</td></tr>
              ) : categories.map(cat => (
                <tr key={cat.id}>
                  <td data-label="">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="table-product-image" style={{ aspectRatio: '1', width: 44, height: 44, objectFit: 'cover' }} />
                    ) : (
                      <div className="table-product-image" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)' }}>◇</div>
                    )}
                  </td>
                  <td data-label="Naziv" style={{ fontWeight: 500, color: 'var(--black)' }}>{cat.name}</td>
                  <td data-label="Slug" style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--gray-400)' }}>{cat.slug}</td>
                  <td data-label="Proizvodi">{productCounts[cat.id] ?? '—'}</td>
                  <td data-label="Aktivna">
                    <label className="toggle">
                      <input type="checkbox" checked={cat.is_active} onChange={() => toggleActive(cat)} />
                      <span className="toggle-track" />
                    </label>
                  </td>
                  <td data-label="">
                    <div className="table-actions">
                      <button className="tbl-btn edit" onClick={() => { setForm({ ...cat }); setModal('edit') }}>Edit</button>
                      <button className="tbl-btn delete" onClick={() => handleDelete(cat.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Category' : 'Edit Category'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </>
        }
      >
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Category Name" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input className="form-input" value={form.slug} onChange={e => setField('slug', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={2} value={form.description} onChange={e => setField('description', e.target.value)} style={{ resize: 'vertical' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-input" value={form.image} onChange={e => setField('image', e.target.value)} placeholder="https://..." />
          {form.image && (
            <div style={{ marginTop: 10, width: 100, height: 100, overflow: 'hidden', background: 'var(--gray-100)' }}>
              <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
        <label className="toggle-wrap">
          <label className="toggle">
            <input type="checkbox" checked={form.is_active} onChange={e => setField('is_active', e.target.checked)} />
            <span className="toggle-track" />
          </label>
          <span style={{ fontSize: '0.875rem' }}>Active</span>
        </label>
      </Modal>
    </div>
  )
}
