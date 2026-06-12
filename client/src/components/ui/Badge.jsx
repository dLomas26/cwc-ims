const statusConfig = {
  available: { label: 'Available', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  assigned: { label: 'Assigned', className: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  under_repair: { label: 'Under Repair', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  damaged: { label: 'Damaged', className: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
  retired: { label: 'Retired', className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  archived: { label: 'Archived', className: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
  good: { label: 'Good Condition', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  stock_in: { label: 'Stock In', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  stock_out: { label: 'Stock Out', className: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  super_admin: { label: 'Super Admin', className: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200' },
  admin: { label: 'Admin', className: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  viewer: { label: 'Viewer', className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
}

const Badge = ({ status, label, className = '', size = 'md' }) => {
  const config = statusConfig[status] || {
    label: label || status,
    className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }

  return (
    <span className={[
      'inline-flex items-center font-medium rounded-full whitespace-nowrap',
      config.className,
      sizes[size],
      className,
    ].join(' ')}>
      {label || config.label}
    </span>
  )
}

export default Badge
