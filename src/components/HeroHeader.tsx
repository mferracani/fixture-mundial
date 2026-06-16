import { RefreshCw, Radio, CalendarClock, CheckCircle2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { formatUpdatedAt } from '@/utils/date'

interface HeroHeaderProps {
  lastUpdatedUtc?: string
  liveCount: number
  upcomingCount: number
  isFetching: boolean
  onRefresh: () => void
  source: string
}

/** Header principal editorial con título, subtítulo y estado global. */
export function HeroHeader({
  lastUpdatedUtc,
  liveCount,
  upcomingCount,
  isFetching,
  onRefresh,
  source,
}: HeroHeaderProps) {
  const globalBadge =
    liveCount > 0 ? (
      <StatusBadge tone="live">
        <span className="relative mr-1 flex h-1.5 w-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
        En vivo · {liveCount}
      </StatusBadge>
    ) : upcomingCount > 0 ? (
      <StatusBadge tone="sky" icon={<CalendarClock size={12} />}>
        Próximos partidos
      </StatusBadge>
    ) : (
      <StatusBadge tone="green" icon={<CheckCircle2 size={12} />}>
        Actualizado
      </StatusBadge>
    )

  return (
    <header className="relative overflow-hidden">
      <div className="relative flex flex-col gap-5 pt-5 sm:pt-12">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 hidden items-center gap-2 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/25 bg-gold-300/[0.07] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-200">
                <Radio size={11} aria-hidden /> Copa del Mundo
              </span>
              {globalBadge}
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-cream sm:text-6xl">
              <span className="text-gold-gradient">Mundial 2026</span>
            </h1>
            <p className="mt-2 hidden max-w-xl text-sm text-cream/55 sm:block sm:text-base">
              Fixture, grupos, resultados y cruces en hora Argentina
            </p>
          </div>

          {/* Última actualización */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-[0.68rem] uppercase tracking-wider text-cream/40">
                Última actualización
              </p>
              <p className="tnum text-sm font-semibold text-cream/80">
                {lastUpdatedUtc ? `${formatUpdatedAt(lastUpdatedUtc)} ARG` : '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              aria-label="Actualizar resultados"
              title={`Fuente de datos: ${source}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cream/70 transition-colors hover:border-gold-300/40 hover:text-gold-100 disabled:opacity-60"
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
