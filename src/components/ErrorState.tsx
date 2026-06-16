import { RefreshCw, WifiOff } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  isRetrying?: boolean
}

/** Estado de error elegante con CTA de reintento. */
export function ErrorState({
  title = 'No pudimos cargar el fixture.',
  description = 'Revisá tu conexión o intentá nuevamente.',
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="glass mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cream/60">
        <WifiOff size={24} aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-cream">{title}</h3>
        <p className="text-sm text-cream/55">{description}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="chip chip-active mt-1 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} aria-hidden />
          Reintentar
        </button>
      )}
    </div>
  )
}
