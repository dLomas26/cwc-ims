import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('cwc_token')
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const { data } = await api.get('/auth/me')
      setUser(data.data)
      setIsAuthenticated(true)
    } catch {
      localStorage.removeItem('cwc_token')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const { token, user: userData } = data.data
    localStorage.setItem('cwc_token', token)
    setUser(userData)
    setIsAuthenticated(true)
    return userData
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore
    }
    localStorage.removeItem('cwc_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const hasRole = (role) => {
    const hierarchy = ['viewer', 'admin', 'super_admin']
    return hierarchy.indexOf(user?.role) >= hierarchy.indexOf(role)
  }

  const isAdmin = () => hasRole('admin')
  const isSuperAdmin = () => hasRole('super_admin')

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      hasRole,
      isAdmin,
      isSuperAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
