import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuth2Callback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setTokenFromOAuth } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      setTokenFromOAuth(token)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const roles = payload.roles || []
      if (roles.includes('ADMIN') || roles.includes('MODERATOR')) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="text-center py-5">
      <div className="spinner mx-auto"></div>
      <p className="text-muted mt-3">Signing you in...</p>
    </div>
  )
}
