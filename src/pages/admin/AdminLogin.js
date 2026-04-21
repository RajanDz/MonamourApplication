import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/admin/dashboard', { replace: true })
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      navigate('/admin/dashboard', { replace: true })
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-left">
        <div className="admin-login-brand">
          <h1>Mon Amour</h1>
          <p>Admin Dashboard</p>
        </div>
      </div>

      <div className="admin-login-right">
        <div className="admin-login-form-wrap">
          <h2>Welcome back</h2>
          <p>Sign in to manage your store.</p>

          {error && <div className="admin-login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@monamour.com"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 32 }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
