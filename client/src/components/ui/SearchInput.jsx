import { useRef, useEffect } from 'react'
import useDebounce from '../../hooks/useDebounce'

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  debounce = 300,
  autoFocus = false,
}) => {
  const inputRef = useRef(null)
  const debouncedChange = useDebounce(onChange, debounce)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleChange = (e) => {
    debouncedChange(e.target.value)
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    onChange('')
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3 text-slate-400 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        ref={inputRef}
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={[
          'w-full h-9 pl-9 pr-8 rounded-lg border border-slate-200',
          'text-sm text-slate-800 placeholder:text-slate-400 bg-white',
          'transition-all duration-150 outline-none',
          'hover:border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400',
        ].join(' ')}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchInput
