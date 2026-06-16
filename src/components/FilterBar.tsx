import type { MatchFilter } from '@/utils/domain'

interface FilterOption {
  value: MatchFilter
  label: string
  count?: number
}

interface FilterBarProps {
  value: MatchFilter
  onChange: (value: MatchFilter) => void
  counts?: { live: number; upcoming: number; finished: number }
  className?: string
}

/** Selector segmentado: Todos / En vivo / Próximos / Finalizados. */
export function FilterBar({ value, onChange, counts, className = '' }: FilterBarProps) {
  const options: FilterOption[] = [
    { value: 'all', label: 'Todos' },
    { value: 'live', label: 'En vivo', count: counts?.live },
    { value: 'upcoming', label: 'Próximos', count: counts?.upcoming },
    { value: 'finished', label: 'Finalizados', count: counts?.finished },
  ]

  return (
    <div
      role="tablist"
      aria-label="Filtrar partidos por estado"
      className={`scroll-elegant flex items-center gap-2 overflow-x-auto pb-1 ${className}`}
    >
      {options.map((opt) => {
        const active = value === opt.value
        const isLive = opt.value === 'live'
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`chip shrink-0 ${active ? 'chip-active' : ''}`}
          >
            {isLive && (opt.count ?? 0) > 0 && (
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
            )}
            {opt.label}
            {opt.count != null && (
              <span
                className={`tnum rounded-full px-1.5 py-px text-[0.65rem] font-bold ${
                  active ? 'bg-gold-300/20 text-gold-100' : 'bg-white/10 text-cream/55'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
