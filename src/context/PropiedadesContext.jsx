import { createContext, useContext, useState, useCallback } from 'react'
import { propiedades as initialPropiedades } from '../data/propiedades.js'
import { applyFilters } from '../services/propiedades.js'

const PropiedadesContext = createContext(null)

export function PropiedadesProvider({ children }) {
  const [list, setList] = useState(() => [...initialPropiedades])

  const addPropiedad = useCallback((prop) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `prop-${Date.now()}`
    setList((prev) => [...prev, { ...prop, id }])
  }, [])

  const removePropiedad = useCallback((id) => {
    setList((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getFiltered = useCallback((filters) => applyFilters(list, filters), [list])

  const value = { list, addPropiedad, removePropiedad, getFiltered }
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
