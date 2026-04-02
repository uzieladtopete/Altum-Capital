'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Download, ChevronDown, X, Mail, User, Phone, Check } from 'lucide-react'

const ITEMS_PER_PAGE = 10
const STRENGTH_OPTIONS = ['Very strong', 'Good', 'Weak', 'Very weak']

function useIsDark() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setMounted(true)
    const m = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(m.matches)
    const on = () => setIsDark(true)
    const off = () => setIsDark(false)
    m.addEventListener('change', (e) => (e.matches ? on() : off()))
    return () => {
      m.removeEventListener('change', on)
      m.removeEventListener('change', off)
    }
  }, [])
  return { mounted, isDark }
}

function getStrengthColors(isDark, strength) {
  const map = {
    'Very weak': {
      bgColor: isDark ? 'bg-red-500/10' : 'bg-red-50',
      borderColor: isDark ? 'border-red-500/30' : 'border-red-200',
      textColor: isDark ? 'text-red-400' : 'text-red-600',
      dotColor: isDark ? 'bg-red-400' : 'bg-red-600',
    },
    Weak: {
      bgColor: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
      borderColor: isDark ? 'border-orange-500/30' : 'border-orange-200',
      textColor: isDark ? 'text-orange-400' : 'text-orange-600',
      dotColor: isDark ? 'bg-orange-400' : 'bg-orange-600',
    },
    Good: {
      bgColor: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      borderColor: isDark ? 'border-blue-500/30' : 'border-blue-200',
      textColor: isDark ? 'text-blue-400' : 'text-blue-600',
      dotColor: isDark ? 'bg-blue-400' : 'bg-blue-600',
    },
    'Very strong': {
      bgColor: isDark ? 'bg-green-500/10' : 'bg-green-50',
      borderColor: isDark ? 'border-green-500/30' : 'border-green-200',
      textColor: isDark ? 'text-green-400' : 'text-green-600',
      dotColor: isDark ? 'bg-green-400' : 'bg-green-600',
    },
  }
  return map[strength] || map.Good
}

export function ContactsTable({
  title = 'Person',
  contacts: initialContacts = [],
  onContactSelect,
  className = '',
  enableAnimations = true,
  showConnectionColumn = false,
  showTwitterColumn = false,
  /** Columna Teléfono + Mensaje separado (panel Consultas) */
  showPhoneColumn = false,
  /** Marcar consulta como revisada (persiste en Supabase) */
  showRevisadoColumn = false,
  /** UUID de la fila cuyo check “revisado” está guardando en Supabase */
  revisadoSavingId = null,
  onRevisadoChange,
}) {
  const [selectedContacts, setSelectedContacts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [filterStrength, setFilterStrength] = useState(null)
  const [selectedContactDetail, setSelectedContactDetail] = useState(null)
  const shouldReduceMotion = useReducedMotion()
  const { mounted, isDark } = useIsDark()

  const handleContactSelect = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    )
    onContactSelect?.(contactId)
  }

  const handleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(paginatedContacts.map((c) => c.id))
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setShowSortMenu(false)
    setCurrentPage(1)
  }

  const handleFilter = (strength) => {
    setFilterStrength(strength)
    setShowFilterMenu(false)
    setCurrentPage(1)
  }

  const sortedAndFilteredContacts = useMemo(() => {
    let filtered = [...initialContacts]
    if (filterStrength) {
      filtered = filtered.filter((c) => c.connectionStrength === filterStrength)
    }
    if (!sortField) return filtered
    return filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (sortField === 'connectionStrength') {
        const map = { 'Very weak': 0, Weak: 1, Good: 2, 'Very strong': 3 }
        aVal = map[aVal] ?? 0
        bVal = map[bVal] ?? 0
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [initialContacts, sortField, sortOrder, filterStrength])

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedAndFilteredContacts.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedAndFilteredContacts, currentPage])

  const totalPages = Math.ceil(sortedAndFilteredContacts.length / ITEMS_PER_PAGE)

  const exportToCSV = () => {
    const headers = showPhoneColumn
      ? ['Nombre', 'Email', 'Teléfono', 'Mensaje']
      : ['Name', 'Email', 'Connection Strength', 'Twitter Followers', 'Description']
    const rows = showPhoneColumn
      ? sortedAndFilteredContacts.map((c) => [c.name, c.email, c.phone || '', c.description || ''])
      : sortedAndFilteredContacts.map((c) => [
          c.name,
          c.email,
          c.connectionStrength,
          c.twitterFollowers,
          c.description || '',
        ])
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(sortedAndFilteredContacts, null, 2)], {
      type: 'application/json;charset=utf-8;',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const shouldAnimate = enableAnimations && !shouldReduceMotion
  const containerVariants = {
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  }
  const rowVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.7 },
    },
  }

  const gridCols = showPhoneColumn && showRevisadoColumn
    ? '40px 48px 220px 200px 140px minmax(200px,1fr) 40px'
    : showPhoneColumn
      ? '40px 220px 200px 140px minmax(200px,1fr) 40px'
      : showConnectionColumn && showTwitterColumn
      ? '40px 220px 140px 140px 200px 1fr 40px'
      : showConnectionColumn
        ? '40px 220px 140px 200px 1fr 40px'
        : showTwitterColumn
          ? '40px 220px 140px 200px 1fr 40px'
          : '40px 220px 200px 1fr 40px'

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2" />
        <div className="flex items-center gap-2 flex-wrap">
          {showConnectionColumn && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`px-3 py-1.5 bg-background border border-border/50 text-foreground text-sm hover:bg-muted/30 transition-colors flex items-center gap-2 rounded-md ${filterStrength ? 'ring-2 ring-primary/30' : ''}`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3H14M4 8H12M6 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filter
                {filterStrength && (
                  <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5">1</span>
                )}
              </button>
              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 mt-1 w-44 bg-background border border-border/50 shadow-lg rounded-md z-20 py-1">
                    <button
                      type="button"
                      onClick={() => handleFilter(null)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${!filterStrength ? 'bg-muted/30' : ''}`}
                    >
                      All
                    </button>
                    <div className="h-px bg-border/30 my-1" />
                    {STRENGTH_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleFilter(s)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${filterStrength === s ? 'bg-muted/30' : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-sm hover:bg-muted/30 transition-colors flex items-center gap-2 rounded-md"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 6L6 3L9 6M6 3V13M13 10L10 13L7 10M10 13V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sort {sortField && <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5">1</span>}
              <ChevronDown size={14} className="opacity-50" />
            </button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-background border border-border/50 shadow-lg rounded-md z-20 py-1">
                  <button type="button" onClick={() => handleSort('name')} className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 ${sortField === 'name' ? 'bg-muted/30' : ''}`}>
                    Name {sortField === 'name' && `(${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`}
                  </button>
                  {showConnectionColumn && (
                    <button type="button" onClick={() => handleSort('connectionStrength')} className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 ${sortField === 'connectionStrength' ? 'bg-muted/30' : ''}`}>
                      Connection {sortField === 'connectionStrength' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  )}
                  {showTwitterColumn && (
                    <button type="button" onClick={() => handleSort('twitterFollowers')} className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/50 ${sortField === 'twitterFollowers' ? 'bg-muted/30' : ''}`}>
                      Followers {sortField === 'twitterFollowers' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-sm hover:bg-muted/30 transition-colors flex items-center gap-2 rounded-md"
            >
              <Download size={14} />
              Export
              <ChevronDown size={14} className="opacity-50" />
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-1 w-32 bg-background border border-border/50 shadow-lg rounded-md z-20">
                  <button type="button" onClick={() => { exportToCSV(); setShowExportMenu(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-2">
                    CSV
                  </button>
                  <button type="button" onClick={() => { exportToJSON(); setShowExportMenu(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-2 border-t border-border/30">
                    JSON
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-background border border-border/50 overflow-hidden rounded-lg relative">
        <div className="overflow-x-auto">
          <div className={showPhoneColumn && showRevisadoColumn ? 'min-w-[928px]' : showPhoneColumn ? 'min-w-[880px]' : 'min-w-[700px]'}>
            <div
              className="px-3 py-3 text-xs font-medium text-muted-foreground/60 bg-muted/5 border-b border-border/30 text-left"
              style={{ display: 'grid', gridTemplateColumns: gridCols, columnGap: 0 }}
            >
              <div className="flex items-center justify-center border-r border-border/20 pr-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border/40 cursor-pointer"
                  style={mounted ? { accentColor: isDark ? 'rgb(113, 113, 122)' : 'rgb(161, 161, 170)' } : {}}
                  checked={paginatedContacts.length > 0 && selectedContacts.length === paginatedContacts.length}
                  onChange={handleSelectAll}
                />
              </div>
              {showRevisadoColumn && (
                <div
                  className="flex items-center justify-center border-r border-border/20 px-1"
                  title="Revisado en Supabase (columna revisado)"
                >
                  <Check size={14} className="opacity-50 text-muted-foreground" aria-hidden />
                  <span className="sr-only">Revisado</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <User size={14} className="opacity-40" />
                <span>{title}</span>
              </div>
              {showConnectionColumn && (
                <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                  <span>Connection</span>
                </div>
              )}
              {showTwitterColumn && (
                <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                  <span>Twitter</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <Mail size={14} className="opacity-40" />
                <span>Email</span>
              </div>
              {showPhoneColumn && (
                <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                  <Phone size={14} className="opacity-40" />
                  <span>Teléfono</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 border-r border-border/20 px-3">
                <span>{showPhoneColumn ? 'Mensaje' : 'Mensaje / Descripción'}</span>
              </div>
              <div className="flex items-center justify-center px-3" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`page-${currentPage}`}
                variants={shouldAnimate ? containerVariants : {}}
                initial={shouldAnimate ? 'hidden' : 'visible'}
                animate="visible"
              >
                {paginatedContacts.map((contact) => {
                  const colors = getStrengthColors(isDark, contact.connectionStrength)
                  return (
                    <motion.div key={contact.id} variants={shouldAnimate ? rowVariants : {}}>
                      <div
                        className={`px-3 py-3.5 group relative transition-all duration-150 border-b border-border/20 ${
                          selectedContacts.includes(contact.id) ? 'bg-muted/30' : 'bg-muted/5 hover:bg-muted/20'
                        }`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: gridCols,
                          columnGap: 0,
                          alignItems: 'center',
                        }}
                      >
                        <div className="flex items-center justify-center border-r border-border/20 pr-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border/40 cursor-pointer"
                            style={mounted ? { accentColor: isDark ? 'rgb(113, 113, 122)' : 'rgb(161, 161, 170)' } : {}}
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleContactSelect(contact.id)}
                          />
                        </div>
                        {showRevisadoColumn && (
                          <div className="flex items-center justify-center border-r border-border/20 px-1">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-border/40 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                              style={mounted ? { accentColor: 'rgb(41, 61, 81)' } : {}}
                              checked={!!contact.revisado}
                              disabled={revisadoSavingId === contact.id || !onRevisadoChange}
                              onChange={(e) => {
                                e.stopPropagation()
                                onRevisadoChange?.(contact.id, e.target.checked)
                              }}
                              aria-label={contact.revisado ? 'Marcar como no revisada' : 'Marcar como revisada'}
                              title="Sincroniza con consultas.revisado en Supabase"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2 min-w-0 border-r border-border/20 px-3">
                          <div className="inline-flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-full">
                            <User size={14} className="opacity-50 flex-shrink-0" />
                            <div className="min-w-0 text-sm text-foreground truncate">{contact.name}</div>
                          </div>
                        </div>
                        {showConnectionColumn && (
                          <div className="flex items-center border-r border-border/20 px-3">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${colors.bgColor} ${colors.textColor} rounded-md`}>
                              {contact.connectionStrength === 'Very strong' ? (
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M8 1L3 9H7L8 15L13 7H9L8 1Z" />
                                </svg>
                              ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${colors.dotColor}`} />
                              )}
                              {contact.connectionStrength}
                            </div>
                          </div>
                        )}
                        {showTwitterColumn && (
                          <div className="flex items-center border-r border-border/20 px-3">
                            <span className="text-sm text-foreground/80">
                              {(contact.twitterFollowers ?? 0).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center min-w-0 border-r border-border/20 px-3">
                          <a href={`mailto:${contact.email}`} className="text-sm text-blue-500 hover:text-blue-600 truncate" onClick={(e) => e.stopPropagation()}>
                            {contact.email}
                          </a>
                        </div>
                        {showPhoneColumn && (
                          <div className="flex items-center min-w-0 border-r border-border/20 px-3">
                            {contact.phone ? (
                              <a
                                href={`tel:${String(contact.phone).replace(/\s+/g, '')}`}
                                className="text-sm text-blue-500 hover:text-blue-600 truncate"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {contact.phone}
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground/80">—</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center min-w-0 border-r border-border/20 px-3">
                          <span className="text-sm text-muted-foreground/80 line-clamp-2">
                            {contact.description || '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-center px-3">
                          <button
                            type="button"
                            onClick={() => setSelectedContactDetail(contact)}
                            className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Ver detalle"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                              <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {selectedContactDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10"
              onClick={() => setSelectedContactDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                className="bg-card border border-border rounded-xl p-6 mx-6 shadow-lg relative max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedContactDetail(null)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{selectedContactDetail.name}</h3>
                      {showConnectionColumn && (
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium ${getStrengthColors(isDark, selectedContactDetail.connectionStrength).bgColor} ${getStrengthColors(isDark, selectedContactDetail.connectionStrength).textColor} rounded-md mt-1`}>
                          {selectedContactDetail.connectionStrength}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Email</span>
                      </div>
                      <a href={`mailto:${selectedContactDetail.email}`} className="text-sm text-blue-500 hover:text-blue-600">
                        {selectedContactDetail.email}
                      </a>
                    </div>
                    {showTwitterColumn && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Twitter Followers</span>
                        <p className="text-sm font-medium text-foreground">
                          {(selectedContactDetail.twitterFollowers ?? 0).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {showPhoneColumn && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Teléfono</span>
                        </div>
                        {selectedContactDetail.phone ? (
                          <a
                            href={`tel:${String(selectedContactDetail.phone).replace(/\s+/g, '')}`}
                            className="text-sm text-blue-500 hover:text-blue-600"
                          >
                            {selectedContactDetail.phone}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">—</p>
                        )}
                      </div>
                    )}
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Mensaje</span>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{selectedContactDetail.description || '—'}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
                      onClick={() => { window.location.href = `mailto:${selectedContactDetail.email}` }}
                    >
                      Enviar email
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-xs text-muted-foreground/70">
            Página {currentPage} de {totalPages} · {sortedAndFilteredContacts.length} registros
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-xs hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-xs hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
