import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useToast } from '../../store/ToastContext'

const icons = {
  success: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const typeStyles = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-indigo-600 text-white',
}

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(show)
  }, [])

  const handleRemove = () => {
    setVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm w-full',
        'transition-all duration-300',
        typeStyles[toast.type] || typeStyles.info,
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
      style={{ minWidth: 280 }}
    >
      <span className="opacity-90">{icons[toast.type] || icons.info}</span>
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={handleRemove}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

const Toast = () => {
  const { toasts, removeToast } = useToast()

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  )
}

export default Toast
