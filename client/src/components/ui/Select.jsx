import { forwardRef } from 'react'

const Select = forwardRef(({
  label,
  error,
  hint,
  placeholder = 'Select...',
  options = [],
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={[
            'w-full h-9 pl-3 pr-8 rounded-lg border bg-white text-sm',
            'transition-all duration-150 outline-none appearance-none cursor-pointer',
            'focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400',
            props.value === '' || props.value === undefined
              ? 'text-slate-400'
              : 'text-slate-800',
            error
              ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400'
              : 'border-slate-200 hover:border-slate-300',
          ].join(' ')}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
