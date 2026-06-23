import type { Team } from '@/types'
import { isLive } from '@/utils/domain'
import { formatTimeArgentina, spainTimeInWindow } from '@/utils/date'
import { Flag } from '@/components/Flag'
import type { AgendaMatch } from '@/utils/agenda'

/** Una línea de equipo dentro de la fila compacta. */
function TeamLine({
  team,
  placeholder,
  confirmed,
  score,
  penalties,
  winner,
  played,
}: {
  team: Team | null
  placeholder?: string
  confirmed: boolean
  score: number | null
  penalties: number | null
  winner: boolean
  played: boolean
}) {
  // Equipo predicho (grupo/cruce sin resolver) => gris. Confirmado => a color.
  const predicted = !!team && !confirmed
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className={predicted ? 'opacity-50 grayscale' : ''}>
        <Flag team={team} size={16} />
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-[0.82rem] ${
          team
            ? winner
              ? 'font-bold text-cream'
              : predicted
                ? 'font-medium italic text-cream/45'
                : played
                  ? 'font-medium text-cream/55'
                  : 'font-medium text-cream/90'
            : 'truncate text-xs italic text-cream/40'
        }`}
        title={team ? `${team.name}${predicted ? ' (probable, a confirmar)' : ''}` : placeholder}
      >
        {team?.name ?? placeholder ?? 'Por definir'}
        {predicted && <span className="ml-1 text-[0.58rem] not-italic text-cream/30">prob.</span>}
      </span>
      {played && (
        <span className="flex items-baseline gap-1">
          {penalties != null && (
            <sup className="tnum text-[0.55rem] font-semibold text-gold-200/80">({penalties})</sup>
          )}
          <span
            className={`tnum w-4 text-right text-sm font-bold tabular-nums ${
              winner ? 'text-cream' : 'text-cream/55'
            }`}
          >
            {score ?? '–'}
          </span>
        </span>
      )}
    </div>
  )
}

/**
 * Fila compacta de partido para la agenda diaria. Pensada para mobile: hora a la
 * izquierda (con hora de España entre paréntesis cuando corresponde), equipos al
 * centro con su marcador si ya se jugó, y la instancia a la derecha. Los equipos
 * de la eliminatoria aún no asegurados se muestran en gris.
 */
export function MatchRow({ item }: { item: AgendaMatch }) {
  const { match, competition, sourceHome, sourceAway, homeConfirmed, awayConfirmed } = item
  const live = isLive(match)
  const finished = match.status === 'finished'
  const played = live || finished
  const time = match.kickoffUtc ? formatTimeArgentina(match.kickoffUtc) : '--:--'
  const spainTime = match.kickoffUtc ? spainTimeInWindow(match.kickoffUtc) : null
  const hasPenalties = match.penaltiesHome != null && match.penaltiesAway != null

  const homeWon = finished && match.winnerTeamId === match.homeTeam?.id
  const awayWon = finished && match.winnerTeamId === match.awayTeam?.id

  return (
    <div
      className={`glass relative flex items-stretch gap-3 p-2.5 ${
        live ? 'ring-1 ring-red-500/30' : ''
      }`}
    >
      {/* Rail: hora ARG (+ España entre paréntesis) + estado */}
      <div className="flex w-[4.25rem] shrink-0 flex-col items-center justify-center border-r border-white/[0.07] pr-2.5 text-center">
        <span className="tnum text-sm font-bold tabular-nums text-cream">{time}</span>
        {spainTime && (
          <span className="tnum mt-0.5 whitespace-nowrap text-[0.55rem] font-medium text-gold-200/80">
            ({spainTime} ESP)
          </span>
        )}
        {live ? (
          <span className="mt-0.5 inline-flex items-center gap-1 text-[0.58rem] font-bold uppercase tracking-wide text-red-300">
            <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-red-400" aria-hidden />
            Vivo
          </span>
        ) : finished ? (
          <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-pitch-400">
            Fin
          </span>
        ) : !spainTime ? (
          <span className="mt-0.5 text-[0.58rem] font-medium uppercase tracking-wide text-cream/35">
            ARG
          </span>
        ) : null}
      </div>

      {/* Equipos + marcador */}
      <div className="min-w-0 flex-1">
        <TeamLine
          team={match.homeTeam}
          placeholder={sourceHome}
          confirmed={homeConfirmed}
          score={match.homeScore}
          penalties={hasPenalties ? match.penaltiesHome : null}
          winner={homeWon}
          played={played}
        />
        <TeamLine
          team={match.awayTeam}
          placeholder={sourceAway}
          confirmed={awayConfirmed}
          score={match.awayScore}
          penalties={hasPenalties ? match.penaltiesAway : null}
          winner={awayWon}
          played={played}
        />
      </div>

      {/* Instancia (grupo / fase) */}
      <div className="flex shrink-0 items-center">
        <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[0.6rem] font-medium text-cream/45">
          {competition}
        </span>
      </div>
    </div>
  )
}
