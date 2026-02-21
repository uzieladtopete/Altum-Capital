import { useState, useEffect, useRef, useCallback } from 'react'
import { searchAddressSuggestions } from '../services/geocoding'

const DEBOUNCE_MS = 400

export default function InputDireccion({
  value,
  onChange,
  onCoordsSelect,
  placeholder = 'Escribe para buscar dirección...',
  id = 'direccion',
  className = '',
  ...inputProps
}) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef(null)
  const wrapperRef = useRef(null)
  const blurTimeoutRef = useRef(null)

  useEffect(() => {
    const q = value?.trim() ?? ''
    if (q.length < 3) {
      // Mantener sugerencias visibles si ya hay algunas
      if (suggestions.length === 0) {
        setOpen(false)
      }
      return
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setLoading(true)
      searchAddressSuggestions(q)
        .then((list) => {
          setSuggestions(list)
          setOpen(true) // Mantener abierto cuando hay sugerencias
        })
        .finally(() => setLoading(false))
    }, DEBOUNCE_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, suggestions.length])

  const handleSelect = useCallback(
    (item) => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
      onChange?.(item.display_name)
      onCoordsSelect?.({ lat: item.lat, lng: item.lng })
      // No cerrar las sugerencias automáticamente - mantenerlas visibles
      // setSuggestions([])
      // setOpen(false)
    },
    [onChange, onCoordsSelect]
  )

  const handleBlur = useCallback(() => {
    // No cerrar automáticamente - dejar las sugerencias visibles
    // blurTimeoutRef.current = setTimeout(() => setOpen(false), 200)
  }, [])

  const handleFocus = useCallback(() => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
    if (suggestions.length > 0 || loading) setOpen(true)
  }, [suggestions.length, loading])

  useEffect(() => {
    function handleClickOutside(e) {
      // Solo cerrar si se hace clic fuera Y no es un elemento de la lista de sugerencias
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        // Verificar si el clic es en un elemento de sugerencia
        const isSuggestionClick = e.target.closest('ul[role="listbox"]')
        if (!isSuggestionClick) {
          if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
          setOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
        {...inputProps}
      />
      {open && (suggestions.length > 0 || loading) && (
        <ul
          className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg py-1"
          role="listbox"
        >
          {loading && suggestions.length === 0 ? (
            <li className="px-4 py-2 text-sm text-gray-500">Buscando...</li>
          ) : (
            suggestions.map((item, i) => (
              <li
                key={`${item.lat}-${item.lng}-${i}`}
                role="option"
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer truncate"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
              >
                {item.display_name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
