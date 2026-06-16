import type { KnockoutTie } from '@/types'
import { KnockoutMatchCard } from './KnockoutMatchCard'

interface KnockoutRoundColumnProps {
  title: string
  ties: KnockoutTie[]
  /** Alineación de la etiqueta y orden visual */
  align?: 'left' | 'right'
  className?: string
}

/** Columna de una fase del bracket (desktop). */
export function KnockoutRoundColumn({
  title,
  ties,
  align = 'left',
  className = '',
}: KnockoutRoundColumnProps) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <h3
        className={`mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-200/70 ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        {title}
      </h3>
      <div className="flex flex-1 flex-col justify-around gap-3">
        {ties.map((tie) => (
          <KnockoutMatchCard key={tie.id} tie={tie} compact />
        ))}
      </div>
    </div>
  )
}
