import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { propiedades as initialPropiedades } from '../data/propiedades.js'
import {
  getPropiedades,
  createPropiedad,
  updatePropiedad as updatePropiedadSupabase,
  deletePropiedad,
} from '../services/propiedadesSupabase'

const PropiedadesContext = createContext(null)

export function PropiedadesProvider({ children }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)


  const loadPropiedades = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPropiedades()
      setList(data || [])
    } catch (error) {
      console.error('Error loading propiedades:', error)
      // Solo usar datos locales en la primera carga; no sobrescribir lista ya cargada desde Supabase
      setList((prev) => (prev.length === 0 ? [...initialPropiedades] : prev))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPropiedades()
  }, [loadPropiedades])

  const addPropiedad = useCallback(async (prop) => {
    const newProp = await createPropiedad(prop)
    await loadPropiedades()
    return newProp
  }, [loadPropiedades])

  const removePropiedad = useCallback(async (id) => {
    await deletePropiedad(id)
    await loadPropiedades()
  }, [loadPropiedades])

  const updatePropiedad = useCallback(async (id, data) => {
    const updated = await updatePropiedadSupabase(id, data)
    await loadPropiedades()
    return updated
  }, [loadPropiedades])

  const getFiltered = useCallback(
    async (filters) => {
      try {
        return await getPropiedades(filters)
      } catch (error) {
        console.error('Error filtering propiedades:', error)
        return []
      }
      },
    []
  )

  const value = {
    list,
    loading,
    addPropiedad,
    removePropiedad,
    updatePropiedad,
    getFiltered,
    refresh: loadPropiedades,
  }

  return (
    <PropiedadesContext.Provider value={value}>
      {children}
    </PropiedadesContext.Provider>
  )
}

export function usePropiedades() {
  const ctx = useContext(PropiedadesContext)
  if (!ctx) throw new Error('usePropiedades must be used within PropiedadesProvider')
  return ctx
}

export default PropiedadesContext
