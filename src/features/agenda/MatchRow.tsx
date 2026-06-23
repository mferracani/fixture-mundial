import type { Team } from '@/types'
import { isLive } from '@/utils/domain'
import { formatTimeArgentina } from '@/utils/date'
import { Flag } from '@/components/Flag'
import type { AgendaMatch } from '@/utils/agenda'

/** Una línea de equipo dentro de la fila compacta. */
function TeamLine({
  team,
  placeholder,
  score,
  penalties,
  winner,
  played,
}: {
  team: Team | null
  placeholder?: string
  score: number | null
  penalties: number | null
  winner: boolean
  played: boolean
}) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <Flag team={team} size={18} />
      <span
        className={`min-w-0 flex-1 truncate text-[0.82rem] ${
          team
            ? winner
              ? 'font-bold text-cream'
              : played
                ? 'font-medium text-cream/55'
                : 'font-medium text-cream/90'
            : 'truncate text-xs italic text-cream/40'
        }`}
        title={team?.name ?? placeholder}
      >
        {team?.name ?? placeholder ?? 'Por definir'}
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
 * izquierda, equipos al centro con su marcador (si ya se jugó) y la instancia a
 * la derecha. Varios partidos entran sin scroll.
 */
export function MatchRow({ item }: { item: AgendaMatch }) {
  const { match, competition, sourceHome, sourceAway } = item
  const live = isLive(match)
  const finished = match.status === 'finished'
  const played = live || finished
  const time = match.kickoffUtc ? formatTimeArgentina(match.kickoffUtc) : '--:--'
  const hasPenalties = match.penaltiesHome != null && match.penaltiesAway != null

  const homeWon = finished && match.winnerTeamId === match.homeTeam?.id
  const awayWon = finished && match.winnerTeamId === match.awayTeam?.id

  return (
    <div
      className={`glass relative flex items-stretch gap-3 p-2.5 ${
        live ? 'ring-1 ring-red-500/30' : ''
      }`}
    >
      {/* Rail: hora + estado */}
      <div className="flex w-11 shrink-0 flex-col items-center justify-center border-r border-white/[0.07] pr-3">
        <span className="tnum text-sm font-bold tabular-nums text-cream">{time}</span>
        {live ? (
          <span className="mt-0.5 inline-flex items-center gap-1 text-[0.58rem] font-bold uppercase tracking-wide text-red-300">
            <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-red-400" aria-hidden />
            Vivo
          </span>
        ) : finished ? (
          <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-pitch-400">
            Fin
          </span>
        ) : (
          <span className="mt-0.5 text-[0.58rem] font-medium uppercase tracking-wide text-cream/35">
            ARG
          </span>
        )}
      </div>

      {/* Equipos + marcador */}
      <div className="min-w-0 flex-1">
        <TeamLine
          team={match.homeTeam}
          placeholder={sourceHome}
          score={match.homeScore}
          penalties={hasPenalties ? match.penaltiesHome : null}
          winner={homeWon}
          played={played}
        />
        <TeamLine
          team={match.awayTeam}
          placeholder={sourceAway}
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
