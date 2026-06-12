import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  hint,
  prefix,
  suffix,
  className = '',
  inputClassName = '',
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
      <div className={[
        'flex items-center gap-2 rounded-lg border bg-white px-3 h-9',
        'transition-all duration-150',
        'focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400',
        error ? 'border-red-400 focus-within:ring-red-500/20 focus-within:border-red-400' : 'border-slate-200 hover:border-slate-300',
      ].join(' ')}>
        {prefix && <span className="text-slate-400 text-sm shrink-0">{prefix}</span>}
        <input
          ref={ref}
          className={[
            'flex-1 min-w-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400',
            'outline-none border-none ring-0',
            inputClassName,
          ].join(' ')}
          {...props}
        />
        {suffix && <span className="text-slate-400 text-sm shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
