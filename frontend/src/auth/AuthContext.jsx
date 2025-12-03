import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

function parseExp(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp ? payload.exp * 1000 : null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!token) return
    const exp = parseExp(token)
    if (exp && Date.now() > exp) {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }, [token])

  const login = async (t) => {
    localStorage.setItem('token', t)
    setToken(t)
  }
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, setUser, login, logout, isAuthenticated: !!token }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }

