const PageHeader = ({
  title,
  subtitle,
  actions,
  backButton,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {backButton && (
          <div className="mb-1">{backButton}</div>
        )}
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
