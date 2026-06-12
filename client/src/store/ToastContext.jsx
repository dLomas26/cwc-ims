import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Returns the toast object directly: { success, error, info }
 * Usage: const toast = useToast(); toast.success('Done!')
 * Also supports destructuring: const { toast } = useToast() — for backward compat
 * The returned object is also iterable so both patterns work.
 */
export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  // Return the toast methods directly, but also allow { toast } destructuring
  // by attaching the full ctx as properties
  const toastFn = ctx.toast
  toastFn.toast = ctx.toast
  toastFn.toasts = ctx.toasts
  toastFn.removeToast = ctx.removeToast
  return toastFn
}

/** Separate hook for the Toast display component */
export const useToastList = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastList must be used within ToastProvider')
  return { toasts: ctx.toasts, removeToast: ctx.removeToast }
}
