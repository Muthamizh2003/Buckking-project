import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function RegisterPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', mobile: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const isAdminOrMod = user?.roles?.some(r => r === 'ADMIN' || r === 'MODERATOR')
      navigate(isAdminOrMod ? '/dashboard' : `/profile/${user.id}`, { replace: true })
    }
  }, [isAuthenticated])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/users/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="card">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h4 className="fw-bold mb-1">Create an account</h4>
            <p className="text-muted" style={{fontSize:'0.875rem'}}>Join the community</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div className="col-6">
                <label className="form-label">Username</label>
                <input className="form-control" name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" required />
              </div>
              <div className="col-6">
                <label className="form-label">Mobile</label>
                <input className="form-control" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit number" required pattern="\d{10}" />
              </div>
              <div className="col-12">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="col-12">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? <span className="spinner" style={{margin:'0 auto',display:'block'}}></span> : 'Create account'}
            </button>
          </form>

          <p className="text-center mt-3 mb-0" style={{fontSize:'0.8125rem'}}>
            <span className="text-muted">Already have an account?</span>{' '}
            <Link to="/login" style={{color:'var(--accent)', fontWeight:500}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
