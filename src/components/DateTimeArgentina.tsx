import { formatKickoffArgentina } from '@/utils/date'

interface DateTimeArgentinaProps {
  kickoffUtc?: string | null
  /** Texto cuando no hay fecha definida */
  fallback?: string
  className?: string
}

/** Muestra fecha y hora del partido en horario de Argentina. */
export function DateTimeArgentina({
  kickoffUtc,
  fallback = 'Fecha a confirmar',
  className = '',
}: DateTimeArgentinaProps) {
  const text = kickoffUtc ? formatKickoffArgentina(kickoffUtc) : fallback
  return (
    <time
      dateTime={kickoffUtc ?? undefined}
      className={`tnum text-xs text-cream/55 ${className}`}
    >
      {text}
    </time>
  )
}
