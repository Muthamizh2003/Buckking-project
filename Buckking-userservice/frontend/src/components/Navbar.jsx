import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <Logo />
        <div className="d-flex align-items-center gap-2">
          {isAuthenticated ? (
            <>
              {(user?.roles?.includes('ADMIN') || user?.roles?.includes('MODERATOR')) && (
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              )}
              <Link className="nav-link" to={`/profile/${user?.username}`}>Profile</Link>
              <span className="text-muted px-2" style={{fontSize:'0.8125rem'}}>
                {user?.name || user?.username}
              </span>
              {user?.roles?.map(r => (
                <span key={r} className={`badge ${r === 'ADMIN' ? 'bg-danger' : r === 'MODERATOR' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{r}</span>
              ))}
              <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Log in</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
