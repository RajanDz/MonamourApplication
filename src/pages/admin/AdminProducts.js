import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const emptyForm = {
  name: '', slug: '', description: '', price: '', sale_price: '',
  images: ['', '', '', '', ''], category_id: '', stock: '0',
  is_featured: false, is_active: true, instagram_link: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
    if (search) q = q.ilike('name', `%${search}%`)
    const { data } = await q
    setProducts(data || [])
    setLoading(false)
  }, [search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    supabase.from('categories').select('id, name').eq('is_active', true).then(({ data }) => setCategories(data || []))
  }, [])

  function openAdd() {
    setForm(emptyForm)
    setModal('add')
  }

  function openEdit(product) {
    setForm({
      ...product,
      price: String(product.price),
      sale_price: product.sale_price ? String(product.sale_price) : '',
      images: [...(product.images || []), '', '', '', '', ''].slice(0, 5),
    })
    setModal('edit')
  }

  function setField(key, value) {
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === 'name' && modal === 'add') next.slug = slugify(value)
      return next
    })
  }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      images: form.images.filter(Boolean),
      category_id: form.category_id || null,
      stock: parseInt(form.stock) || 0,
      is_featured: form.is_featured,
      is_active: form.is_active,
      instagram_link: form.instagram_link || null,
    }

    let error
    if (modal === 'add') {
      ;({ error } = await supabase.from('products').insert(payload))
    } else {
      ;({ error } = await supabase.from('products').update(payload).eq('id', form.id))
    }

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(modal === 'add' ? 'Product created' : 'Product updated')
      setModal(null)
      fetchProducts()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    setDeleting(id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Product deleted'); fetchProducts() }
    setDeleting(null)
  }

  async function toggleActive(product) {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    fetchProducts()
  }

  return (
    <div className="page-fade">
      <div className="admin-page-title" style={{ marginBottom: 24 }}>Products</div>

      <div className="admin-card">
        <div className="admin-card-header">
          <input
            className="admin-search-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Product</button>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray-300)', padding: 32 }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray-300)', padding: 32 }}>No products yet</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td data-label="">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="table-product-image" />
                    ) : (
                      <div className="table-product-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)' }}>◇</div>
                    )}
                  </td>
                  <td data-label="Naziv">
                    <div style={{ fontWeight: 500, color: 'var(--black)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{p.slug}</div>
                  </td>
                  <td data-label="Kategorija">{p.categories?.name || '—'}</td>
                  <td data-label="Cijena">
                    <div>${p.price}</div>
                    {p.sale_price && <div style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>${p.sale_price} sale</div>}
                  </td>
                  <td data-label="Zaliha">{p.stock}</td>
                  <td data-label="Aktivan">
                    <label className="toggle">
                      <input type="checkbox" checked={p.is_active} onChange={() => toggleActive(p)} />
                      <span className="toggle-track" />
                    </label>
                  </td>
                  <td data-label="">
                    <div className="table-actions">
                      <button className="tbl-btn edit" onClick={() => openEdit(p)}>Edit</button>
                      <button className="tbl-btn delete" onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
                        {deleting === p.id ? '...' : 'Delete'}
                      </button>
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
        title={modal === 'add' ? 'Add Product' : 'Edit Product'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </>
        }
      >
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Product Name" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input className="form-input" value={form.slug} onChange={e => setField('slug', e.target.value)} placeholder="product-slug" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={e => setField('description', e.target.value)} style={{ resize: 'vertical' }} />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Price *</label>
            <input className="form-input" type="number" step="0.01" value={form.price} onChange={e => setField('price', e.target.value)} placeholder="99.00" />
          </div>
          <div className="form-group">
            <label className="form-label">Sale Price</label>
            <input className="form-input" type="number" step="0.01" value={form.sale_price} onChange={e => setField('sale_price', e.target.value)} placeholder="Optional" />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category_id} onChange={e => setField('category_id', e.target.value)}>
              <option value="">No Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Stock</label>
            <input className="form-input" type="number" value={form.stock} onChange={e => setField('stock', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Images (URLs)</label>
          {form.images.map((img, i) => (
            <div key={i} className="image-url-row">
              <input
                className="form-input"
                value={img}
                onChange={e => {
                  const imgs = [...form.images]
                  imgs[i] = e.target.value
                  setField('images', imgs)
                }}
                placeholder={`Image ${i + 1} URL`}
              />
            </div>
          ))}
          {form.images.filter(Boolean).length > 0 && (
            <div className="image-preview-grid">
              {form.images.filter(Boolean).map((img, i) => (
                <div key={i} className="image-preview">
                  <img src={img} alt="" onError={e => e.target.style.display = 'none'} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Instagram Link (optional)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--gray-300)', paddingBottom: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: '#E1306C' }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            <input
              className="form-input"
              value={form.instagram_link}
              onChange={e => setField('instagram_link', e.target.value)}
              placeholder="https://instagram.com/p/POST_ID ili https://ig.me/m/USERNAME"
              style={{ border: 'none', padding: '0', flex: 1 }}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 6 }}>
            Link na Instagram post ili DM. Kupci kliknu → šalju poruku sa butika.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          <label className="toggle-wrap">
            <label className="toggle">
              <input type="checkbox" checked={form.is_featured} onChange={e => setField('is_featured', e.target.checked)} />
              <span className="toggle-track" />
            </label>
            <span style={{ fontSize: '0.875rem' }}>Featured</span>
          </label>
          <label className="toggle-wrap">
            <label className="toggle">
              <input type="checkbox" checked={form.is_active} onChange={e => setField('is_active', e.target.checked)} />
              <span className="toggle-track" />
            </label>
            <span style={{ fontSize: '0.875rem' }}>Active</span>
          </label>
        </div>
      </Modal>
    </div>
  )
}
