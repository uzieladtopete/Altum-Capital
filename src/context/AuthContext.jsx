import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('usuario')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserRole(session.user.id).catch((error) => {
          console.error('Error loading user role on mount:', error)
          setRole('usuario')
        })
      } else {
        setRole('usuario')
      }
      setLoading(false)
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserRole(session.user.id).catch((error) => {
          console.error('Error loading user role on auth change:', error)
          setRole('usuario')
        })
      } else {
        setRole('usuario')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserRole = async (userId) => {
    if (!userId) {
      setRole('usuario')
      return
    }
    
    try {
      // Intentar con diferentes nombres de tabla posibles
      const tableNames = ['usuarios_admin', 'Usuarios', 'usuarios']
      let roleData = null
      
      for (const tableName of tableNames) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('role')
            .eq('id', userId)
            .single()
          
          if (data && !error) {
            roleData = data
            break
          }
        } catch (tableError) {
          // Continuar con la siguiente tabla si esta falla
          continue
        }
      }
      
      if (roleData) {
        setRole(roleData.role || 'usuario')
      } else {
        // Si no se encontró rol, usar 'usuario' por defecto
        setRole('usuario')
      }
    } catch (error) {
      // Error general - no romper la aplicación, solo loggear y usar rol por defecto
      console.error('Error loading user role:', error)
      setRole('usuario')
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    
    // Crear registro en tabla usuarios
    if (data.user) {
      // Intentar con diferentes nombres de tabla posibles
      const tableNames = ['usuarios_admin', 'Usuarios', 'usuarios']
      let success = false
      
      for (const tableName of tableNames) {
        const { error } = await supabase.from(tableName).insert({
          id: data.user.id,
          email: data.user.email,
          role: 'usuario',
        })
        
        if (!error) {
          success = true
          break
        }
      }
      
      if (!success) {
        console.warn('⚠️  No se pudo crear registro en tabla usuarios')
      }
    }
    
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const toggleRole = () => {
    // Solo para desarrollo - eliminar en producción
    setRole((prev) => (prev === 'usuario' ? 'admin' : 'usuario'))
  }

  const value = {
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    toggleRole, // Solo desarrollo
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
