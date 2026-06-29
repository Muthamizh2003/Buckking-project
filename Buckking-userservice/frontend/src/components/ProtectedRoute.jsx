import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (roles) {
    const hasRole = roles.some((r) => user?.roles?.includes(r))
    if (!hasRole) return <Navigate to="/home" replace />
  }

  return children
}
