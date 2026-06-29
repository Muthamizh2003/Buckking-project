import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const isAuthenticated = !!token

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const initFromToken = (jwt) => {
    const payload = JSON.parse(atob(jwt.split('.')[1]))
    setToken(jwt)
    setUser({
      id: payload.userId,
      username: payload.sub,
      name: payload.name || payload.sub,
      roles: payload.roles || [],
    })
  }

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    const { token: jwt } = res.data
    initFromToken(jwt)
    return jwt
  }

  const setTokenFromOAuth = initFromToken

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, setTokenFromOAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
