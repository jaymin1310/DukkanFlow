import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')
    const shopName = localStorage.getItem('shopName')
    const shopId = localStorage.getItem('shopId')
    if (token) {
      setUser({ token, name, email, role, shopName, shopId })
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('name', data.name)
    localStorage.setItem('email', data.email)
    localStorage.setItem('role', data.role)
    localStorage.setItem('shopName', data.shopName)
    localStorage.setItem('shopId', data.shopId)
    setUser(data)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}