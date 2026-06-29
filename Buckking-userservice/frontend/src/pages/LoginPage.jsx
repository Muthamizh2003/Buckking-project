import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const isAdminOrMod = user?.roles?.some(r => r === 'ADMIN' || r === 'MODERATOR')
      navigate(isAdminOrMod ? '/dashboard' : '/home', { replace: true })
    }
  }, [isAuthenticated])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form.username, form.password)
      const payload = JSON.parse(atob(data.split('.')[1]))
      const roles = payload.roles || []
      if (roles.includes('ADMIN') || roles.includes('MODERATOR')) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="card">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h4 className="fw-bold mb-1">Welcome back</h4>
            <p className="text-muted" style={{fontSize:'0.875rem'}}>Sign in to your account</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username or email</label>
              <input
                className="form-control"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <span className="spinner" style={{margin:'0 auto',display:'block'}}></span> : 'Sign in'}
            </button>
          </form>

          <div className="oauth-divider">or continue with</div>

          <a href="http://localhost:8081/oauth2/authorization/github" className="btn btn-github w-100">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            Continue with GitHub
          </a>

          <p className="text-center mt-3 mb-0" style={{fontSize:'0.8125rem'}}>
            <span className="text-muted">Don't have an account?</span>{' '}
            <Link to="/register" style={{color:'var(--accent)', fontWeight:500}}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
