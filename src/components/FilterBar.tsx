import type { MatchFilter } from '@/utils/domain'

interface FilterBarProps {
  value: MatchFilter
  onChange: (value: MatchFilter) => void
  counts?: { upcoming: number }
  className?: string
}

/** Acceso rapido a la vista cronologica de proximos partidos. */
export function FilterBar({ value, onChange, counts, className = '' }: FilterBarProps) {
  const active = value === 'upcoming'

  return (
    <div
      role="tablist"
      aria-label="Vista de partidos"
      className={`scroll-elegant flex items-center gap-2 overflow-x-auto pb-1 ${className}`}
    >
      <button
        role="tab"
        aria-selected={active}
        type="button"
        onClick={() => onChange('upcoming')}
        className={`chip shrink-0 ${active ? 'chip-active' : ''}`}
      >
        Próximos
        <span
          className={`tnum rounded-full px-1.5 py-px text-[0.65rem] font-bold ${
            active ? 'bg-gold-300/20 text-gold-100' : 'bg-white/10 text-cream/55'
          }`}
        >
          {counts?.upcoming ?? 0}
        </span>
      </button>
    </div>
  )
}
