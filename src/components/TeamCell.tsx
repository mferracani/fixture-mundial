import type { Team } from '@/types'
import { Flag } from './Flag'

interface TeamCellProps {
  team?: Team | null
  /** Texto placeholder cuando el equipo no está definido (ej: "Ganador Grupo A") */
  placeholder?: string
  /** Mostrar nombre completo en vez de abreviado */
  full?: boolean
  /** Alinear a la derecha (equipo visitante) */
  align?: 'left' | 'right'
  flagSize?: number
  bold?: boolean
  dimmed?: boolean
  className?: string
}

/** Celda de equipo: bandera + nombre. Reutilizable en tablas y cards. */
export function TeamCell({
  team,
  placeholder = 'Por definir',
  full = false,
  align = 'left',
  flagSize = 22,
  bold = false,
  dimmed = false,
  className = '',
}: TeamCellProps) {
  const name = team ? (full ? team.name : team.shortName) : placeholder
  const isRight = align === 'right'

  return (
    <span
      className={`flex min-w-0 items-center gap-2.5 ${isRight ? 'flex-row-reverse text-right' : ''} ${className}`}
    >
      <Flag team={team} size={flagSize} />
      <span
        className={`truncate ${bold ? 'font-bold' : 'font-medium'} ${
          team ? (dimmed ? 'text-cream/45' : 'text-cream') : 'italic text-cream/40'
        }`}
        title={team?.name ?? placeholder}
      >
        {name}
      </span>
    </span>
  )
}
