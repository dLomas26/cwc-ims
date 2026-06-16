import { useEffect, useMemo, useRef, useState } from 'react'
import useDebounce from '../../hooks/useDebounce'

const MAX_VISIBLE = 50

const SearchableSelect = ({
  label,
  placeholder = 'Select...',
  options = [],
  value,
  onChange,
  onSearchChange,
  error,
  hint,
  loading = false,
  required = false,
  disabled = false,
  emptyMessage = 'No results',
  className = '',
}) => {
  const serverSide = typeof onSearchChange === 'function'
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [selectedCache, setSelectedCache] = useState(null)

  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const debouncedSearchChange = useDebounce(
    (v) => { if (serverSide) onSearchChange(v) },
    250,
  )

  const filtered = useMemo(() => {
    if (serverSide) return options
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) =>
        o.label?.toLowerCase().includes(q) ||
        o.sublabel?.toLowerCase().includes(q),
    )
  }, [options, search, serverSide])

  const visible = serverSide ? filtered : filtered.slice(0, MAX_VISIBLE)
  const truncated = serverSide ? 0 : Math.max(0, filtered.length - visible.length)

  const fromOptions = options.find((o) => o.value === value) || null
  const selected =
    fromOptions ||
    (selectedCache && selectedCache.value === value ? selectedCache : null)

  // Keep cache in sync: capture latest matching option when it appears,
  // and clear cache when value is cleared externally.
  useEffect(() => {
    if (!value) {
      if (selectedCache) setSelectedCache(null)
      return
    }
    if (fromOptions && (!selectedCache || selectedCache.value !== value)) {
      setSelectedCache(fromOptions)
    }
  }, [value, fromOptions, selectedCache])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  useEffect(() => {
    if (open) {
      setHighlight(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      setSearch('')
      if (serverSide) onSearchChange('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    setHighlight(0)
  }, [search, options])

  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector(`[data-idx="${highlight}"]`)
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [highlight, open])

  const handleSearchInput = (v) => {
    setSearch(v)
    if (serverSide) debouncedSearchChange(v)
  }

  const handleSelect = (opt) => {
    setSelectedCache(opt)
    onChange?.(opt.value)
    setOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setSelectedCache(null)
    onChange?.('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, visible.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = visible[highlight]
      if (opt) handleSelect(opt)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={`flex flex-col gap-1.5 relative ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (disabled) return
          if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className={[
          'flex items-center h-9 rounded-lg border px-3 bg-white transition-all duration-150',
          disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'cursor-pointer',
          open
            ? 'ring-2 ring-indigo-500/20 border-indigo-400'
            : 'border-slate-200 hover:border-slate-300',
          error ? 'border-red-400' : '',
        ].join(' ')}
      >
        {selected ? (
          <div className="flex-1 min-w-0 flex items-baseline gap-2 truncate">
            <span className="text-sm text-slate-800 font-medium truncate">{selected.label}</span>
            {selected.sublabel && (
              <span className="text-xs text-slate-400 truncate">{selected.sublabel}</span>
            )}
          </div>
        ) : (
          <span className="text-sm text-slate-400 flex-1 truncate">{placeholder}</span>
        )}

        {selected && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-300 hover:text-slate-500 transition-colors mr-1 shrink-0"
            aria-label="Clear selection"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              placeholder={`Search ${label?.toLowerCase() || 'options'}...`}
              value={search}
              onChange={(e) => handleSearchInput(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              className="w-full text-sm outline-none text-slate-800 placeholder:text-slate-400"
            />
            {loading && (
              <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </div>

          <div ref={listRef} className="max-h-60 overflow-y-auto" role="listbox">
            {loading && visible.length === 0 ? (
              <div className="py-4 text-center text-sm text-slate-400">Loading...</div>
            ) : visible.length === 0 ? (
              <div className="py-4 text-center text-sm text-slate-400">
                {search ? `${emptyMessage} for "${search}"` : emptyMessage}
              </div>
            ) : (
              visible.map((opt, idx) => {
                const isSelected = opt.value === value
                const isHighlighted = idx === highlight
                return (
                  <div
                    key={opt.value}
                    data-idx={idx}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlight(idx)}
                    className={[
                      'flex flex-col px-3 py-2 cursor-pointer transition-colors',
                      isHighlighted ? 'bg-indigo-50' : '',
                      isSelected && !isHighlighted ? 'bg-slate-50' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-800 truncate">{opt.label}</span>
                      {isSelected && (
                        <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {opt.sublabel && (
                      <span className="text-xs text-slate-400 truncate">{opt.sublabel}</span>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {truncated > 0 && (
            <div className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 border-t border-slate-100 text-center">
              Showing {visible.length} of {filtered.length} — refine search to see more
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export default SearchableSelect
