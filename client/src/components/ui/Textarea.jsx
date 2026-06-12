import { forwardRef } from 'react'

const Textarea = forwardRef(({
  label,
  error,
  hint,
  className = '',
  required = false,
  rows = 3,
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
      <textarea
        ref={ref}
        rows={rows}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800',
          'placeholder:text-slate-400 resize-none',
          'transition-all duration-150 outline-none',
          'focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400',
          error
            ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400'
            : 'border-slate-200 hover:border-slate-300',
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
