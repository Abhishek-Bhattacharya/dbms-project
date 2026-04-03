import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../api/hostelApi'

const AuthContext = createContext(null)
const STORAGE_KEY = 'hostel_auth'

function readStoredAuth() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuth())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = async (payload) => {
    setLoading(true)
    try {
      const data = await loginUser(payload)
      setUser(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const data = await registerUser(payload)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user)
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
