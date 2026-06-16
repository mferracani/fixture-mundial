import { SearchX, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
}

/** Estado vacío reutilizable. */
export function EmptyState({
  title = 'Todavía no hay información disponible para esta sección.',
  description,
  onRetry,
  retryLabel = 'Reintentar',
}: EmptyStateProps) {
  return (
    <div className="glass-soft mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cream/50">
        <SearchX size={24} aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-cream/90">{title}</h3>
        {description && <p className="text-sm text-cream/50">{description}</p>}
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="chip mt-1">
          <RefreshCw size={14} aria-hidden />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
