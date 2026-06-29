import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import OAuth2Callback from './pages/OAuth2Callback'

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return children
  const isAdminOrMod = user?.roles?.some(r => r === 'ADMIN' || r === 'MODERATOR')
  return <Navigate to={isAdminOrMod ? '/dashboard' : '/home'} replace />
}

export default function App() {
  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['ADMIN', 'MODERATOR']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  )
}
