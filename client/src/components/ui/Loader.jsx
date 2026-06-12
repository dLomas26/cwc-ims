export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-3',
  }

  return (
    <div
      className={[
        'rounded-full border-slate-200 border-t-indigo-600 animate-spin',
        sizes[size],
        className,
      ].join(' ')}
    />
  )
}

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
)

export const FullPageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="xl" />
      <p className="text-sm text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
)

export const SkeletonRow = ({ cols = 5 }) => (
  <tr className="border-b border-slate-100">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
)
