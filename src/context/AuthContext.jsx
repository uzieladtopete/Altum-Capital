import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * Provider de autenticación/rol.
 * Temporal: role + toggleRole para desarrollo.
 * Futuro: reemplazar por user, login(), logout(), loading, etc. (JWT/NextAuth).
 */
export function AuthProvider({ children }) {
  const [role, setRole] = useState('usuario') // "usuario" | "admin"

  const toggleRole = () => {
    setRole((prev) => (prev === 'usuario' ? 'admin' : 'usuario'))
  }

  const value = { role, toggleRole }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
