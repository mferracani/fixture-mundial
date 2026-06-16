import type { Standing, Team } from '@/types'
import { Flag } from './Flag'

interface StandingsTableProps {
  standings: Standing[]
  teams: Team[]
  /** Resaltar fila de un equipo buscado */
  highlightTeamId?: string | null
}

const COLS = [
  { key: 'played', label: 'PJ', title: 'Partidos jugados' },
  { key: 'won', label: 'G', title: 'Ganados' },
  { key: 'drawn', label: 'E', title: 'Empatados' },
  { key: 'lost', label: 'P', title: 'Perdidos' },
  { key: 'goalsFor', label: 'GF', title: 'Goles a favor' },
  { key: 'goalsAgainst', label: 'GC', title: 'Goles en contra' },
  { key: 'goalDifference', label: 'DG', title: 'Diferencia de gol' },
] as const

/** Indicador lateral de zona de clasificación (no depende solo del color). */
function QualMarker({ status }: { status: Standing['qualificationStatus'] }) {
  if (status === 'direct') {
    return (
      <span
        className="absolute inset-y-1 left-0 w-1 rounded-full bg-pitch-500"
        aria-hidden
      />
    )
  }
  if (status === 'best-third') {
    return (
      <span
        className="absolute inset-y-1 left-0 w-1 rounded-full bg-gold-400/80"
        aria-hidden
      />
    )
  }
  return null
}

function qualLabel(status: Standing['qualificationStatus']): string {
  switch (status) {
    case 'direct':
      return 'Clasifica a eliminatorias'
    case 'best-third':
      return 'Puede clasificar según ranking de terceros'
    case 'eliminated':
      return 'Sin chances de clasificación directa'
    default:
      return ''
  }
}

export function StandingsTable({ standings, teams, highlightTeamId }: StandingsTableProps) {
  const teamById = (id: string) => teams.find((t) => t.id === id)

  return (
    <div className="scroll-elegant -mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[336px] border-separate border-spacing-y-1 text-[0.8rem]">
        <caption className="sr-only">Tabla de posiciones del grupo</caption>
        <thead>
          <tr className="text-[0.68rem] uppercase tracking-wider text-cream/40">
            <th scope="col" className="sticky left-0 z-10 bg-night-900/0 px-1 py-1 text-left font-semibold">
              <span className="pl-2">Equipo</span>
            </th>
            {COLS.map((c) => (
              <th
                key={c.key}
                scope="col"
                title={c.title}
                className="w-7 px-0.5 py-1 text-center font-semibold"
              >
                {c.label}
              </th>
            ))}
            <th scope="col" title="Puntos" className="w-10 px-1 py-1 text-center font-bold text-gold-200/80">
              PTS
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => {
            const team = teamById(s.teamId)
            const highlighted = highlightTeamId && s.teamId === highlightTeamId
            const qualified = s.qualificationStatus === 'direct'
            const bestThird = s.qualificationStatus === 'best-third'
            return (
              <tr
                key={s.teamId}
                className={`group transition-colors ${
                  highlighted ? 'ring-1 ring-gold-300/50' : ''
                }`}
              >
                {/* Posición + equipo (sticky en mobile) */}
                <th
                  scope="row"
                  className={`sticky left-0 z-10 rounded-l-lg px-1 py-1.5 text-left font-normal backdrop-blur-sm ${
                    qualified
                      ? 'bg-pitch-500/[0.08]'
                      : bestThird
                        ? 'bg-gold-300/[0.06]'
                        : 'bg-white/[0.02]'
                  }`}
                >
                  <span className="relative flex items-center gap-2 pl-2">
                    <QualMarker status={s.qualificationStatus} />
                    <span className="tnum w-4 shrink-0 text-center text-xs font-bold text-cream/50">
                      {s.rank}
                    </span>
                    <Flag team={team} size={18} />
                    <span
                      className="truncate font-semibold text-cream"
                      title={`${team?.name ?? ''} — ${qualLabel(s.qualificationStatus)}`}
                    >
                      {team?.shortName ?? '—'}
                    </span>
                    {(qualified || bestThird) && (
                      <span className="sr-only">{qualLabel(s.qualificationStatus)}</span>
                    )}
                  </span>
                </th>
                {COLS.map((c) => (
                  <td
                    key={c.key}
                    className={`tnum px-0.5 py-1.5 text-center tabular-nums ${
                      qualified ? 'bg-pitch-500/[0.05]' : bestThird ? 'bg-gold-300/[0.04]' : 'bg-white/[0.015]'
                    } ${c.key === 'goalDifference' ? 'text-cream/70' : 'text-cream/65'}`}
                  >
                    {c.key === 'goalDifference' && s.goalDifference > 0 ? '+' : ''}
                    {s[c.key]}
                  </td>
                ))}
                <td
                  className={`tnum rounded-r-lg px-1 py-1.5 text-center text-base font-bold tabular-nums ${
                    qualified
                      ? 'bg-pitch-500/[0.08] text-pitch-400'
                      : bestThird
                        ? 'bg-gold-300/[0.06] text-gold-200'
                        : 'bg-white/[0.02] text-cream'
                  }`}
                >
                  {s.points}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
