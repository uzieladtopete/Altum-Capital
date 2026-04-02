import { useState, useEffect, useCallback } from 'react'
import { countConsultasNoRevisadas } from '../services/consultasSupabase'

/**
 * Cuenta consultas con revisado = false (solo cuando enabled, p. ej. admin logueado).
 */
export function useConsultasPendientesCount(enabled) {
  const [count, setCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!enabled) {
      setCount(0)
      return
    }
    const n = await countConsultasNoRevisadas()
    setCount(typeof n === 'number' ? n : 0)
  }, [enabled])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 45000)
    return () => clearInterval(id)
  }, [refresh])

  useEffect(() => {
    if (!enabled) return
    const onPing = () => {
      refresh()
    }
    window.addEventListener('altum-consultas-count-refresh', onPing)
    return () => window.removeEventListener('altum-consultas-count-refresh', onPing)
  }, [enabled, refresh])

  return { count, refresh }
}
