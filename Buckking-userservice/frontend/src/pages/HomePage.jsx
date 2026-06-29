import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="text-center mb-5">
          <div className="avatar-placeholder mx-auto mb-3" style={{width:96,height:96,fontSize:'2rem'}}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h3 className="fw-bold mb-1">Welcome, {user?.name || user?.username}</h3>
          <p className="text-muted" style={{fontSize:'0.875rem'}}>You are signed in as <strong>{user?.name || user?.username}</strong></p>
          <div className="d-flex justify-content-center gap-2 mb-3">
            {user?.roles?.map(r => (
              <span key={r} className={`badge ${r === 'ADMIN' ? 'bg-danger' : r === 'MODERATOR' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{r}</span>
            ))}
          </div>
        </div>

        <div className="row g-3">
          <div className="col-6">
            <Link to={`/profile/${user?.username}`} className="card text-decoration-none" style={{display:'block'}}>
              <div className="card-body text-center py-4">
                <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>👤</div>
                <div className="fw600">My Profile</div>
                <div className="text-muted" style={{fontSize:'0.8125rem'}}>View and edit your profile</div>
              </div>
            </Link>
          </div>
          <div className="col-6">
            <Link to="/dashboard" className="card text-decoration-none" style={{display:'block'}}>
              <div className="card-body text-center py-4">
                <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>🏠</div>
                <div className="fw600">Communities</div>
                <div className="text-muted" style={{fontSize:'0.8125rem'}}>Browse communities</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
