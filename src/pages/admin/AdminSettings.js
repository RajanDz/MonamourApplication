import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const SETTINGS = [
  {
    key: 'announcement_bar',
    label: 'Announcement Bar Text',
    description: 'The text displayed in the top announcement bar',
    type: 'text',
  },
  {
    key: 'announcement_bar_active',
    label: 'Show Announcement Bar',
    description: 'Toggle the announcement bar on or off',
    type: 'toggle',
  },
  {
    key: 'store_name',
    label: 'Store Name',
    description: 'Your store name shown in browser tab and footer',
    type: 'text',
  },
  {
    key: 'free_shipping_threshold',
    label: 'Free Shipping Threshold ($)',
    description: 'Orders above this amount get free shipping',
    type: 'number',
  },
]

export default function AdminSettings() {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) {
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        setValues(map)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function saveSetting(key, value) {
    setSaving(s => ({ ...s, [key]: true }))
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value: String(value) }, { onConflict: 'key' })
    if (error) toast.error(error.message)
    else toast.success('Setting saved')
    setSaving(s => ({ ...s, [key]: false }))
  }

  function handleChange(key, value) {
    setValues(v => ({ ...v, [key]: value }))
  }

  if (loading) return <div style={{ color: 'var(--gray-300)', padding: 40 }}>Loading...</div>

  return (
    <div className="page-fade">
      <div className="admin-page-title" style={{ marginBottom: 24 }}>Settings</div>

      <div className="admin-card" style={{ padding: '0 24px' }}>
        {SETTINGS.map(setting => (
          <div key={setting.key} className="settings-row">
            <div className="settings-row-info">
              <h4>{setting.label}</h4>
              <p>{setting.description}</p>
            </div>
            <div className="settings-row-control">
              {setting.type === 'toggle' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={values[setting.key] === 'true'}
                      onChange={e => {
                        const val = e.target.checked ? 'true' : 'false'
                        handleChange(setting.key, val)
                        saveSetting(setting.key, val)
                      }}
                    />
                    <span className="toggle-track" />
                  </label>
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    {values[setting.key] === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="form-input"
                    type={setting.type === 'number' ? 'number' : 'text'}
                    value={values[setting.key] || ''}
                    onChange={e => handleChange(setting.key, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => saveSetting(setting.key, values[setting.key] || '')}
                    disabled={saving[setting.key]}
                  >
                    {saving[setting.key] ? '...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Settings */}
      <div style={{ marginTop: 32 }}>
        <div className="admin-page-title" style={{ fontSize: '1.1rem', marginBottom: 16 }}>All Settings (Raw)</div>
        <CustomSettingsEditor />
      </div>
    </div>
  )
}

function CustomSettingsEditor() {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [allSettings, setAllSettings] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadAll() {
    setLoading(true)
    const { data } = await supabase.from('settings').select('key, value').order('key')
    setAllSettings(data || [])
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!key.trim()) return
    const { error } = await supabase.from('settings').upsert({ key: key.trim(), value }, { onConflict: 'key' })
    if (error) toast.error(error.message)
    else { toast.success('Setting saved'); setKey(''); setValue(''); loadAll() }
  }

  async function handleDelete(k) {
    if (!window.confirm(`Delete setting "${k}"?`)) return
    await supabase.from('settings').delete().eq('key', k)
    loadAll()
  }

  if (loading) return null

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Custom Key/Value Settings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>Key</th><th>Value</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {allSettings.map(s => (
              <tr key={s.key}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{s.key}</td>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</td>
                <td>
                  <button className="tbl-btn delete" onClick={() => handleDelete(s.key)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ padding: 16 }}>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10 }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="key" value={key} onChange={e => setKey(e.target.value)} />
                  <input className="form-input" style={{ flex: 2 }} placeholder="value" value={value} onChange={e => setValue(e.target.value)} />
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
