import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Logo({ size = 28 }) {
  const { isAuthenticated, user } = useAuth()
  const isAdminOrMod = user?.roles?.some(r => r === 'ADMIN' || r === 'MODERATOR')
  const home = !isAuthenticated ? '/login' : isAdminOrMod ? '/dashboard' : '/home'

  return (
    <Link className="navbar-brand d-flex align-items-center gap-2" to={home}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
        <path d="M10 20c0-4 2-8 6-8s6 4 6 8" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M16 12V8" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 10l-2 3" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M20 10l2 3" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="13" cy="17" r="1" fill="var(--accent)" />
        <circle cx="19" cy="17" r="1" fill="var(--accent)" />
        <path d="M14 15c0 1 1 1 2 1s2 0 2-1" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" fill="none" />
      </svg>
      <span>buckking</span>
    </Link>
  )
}
