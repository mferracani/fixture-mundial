import { MapPin, Trophy } from 'lucide-react'
import type { KnockoutTie, Team } from '@/types'
import { isLive } from '@/utils/domain'
import { useResults } from '@/store/results'
import { Flag } from '@/components/Flag'
import { MatchStatusBadge } from '@/components/MatchStatusBadge'
import { DateTimeArgentina } from '@/components/DateTimeArgentina'
import { ScoreEditor } from '@/components/ScoreEditor'

interface KnockoutMatchCardProps {
  tie: KnockoutTie
  className?: string
  compact?: boolean
}

/** Una fila de equipo dentro de la card de cruce. */
function TeamRow({
  team,
  placeholder,
  confirmed,
  score,
  penalties,
  isWinner,
  played,
}: {
  team: Team | null
  placeholder: string
  confirmed: boolean
  score: number | null
  penalties: number | null
  isWinner: boolean
  played: boolean
}) {
  // Equipo predicho (grupo sin terminar / cruce sin resolver) => gris.
  // Equipo confirmado => bandera y nombre a color real.
  const predicted = !!team && !confirmed
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
        isWinner ? 'bg-gold-300/[0.08]' : ''
      }`}
    >
      <span className={predicted ? 'opacity-50 grayscale' : ''}>
        <Flag team={team} size={20} />
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-[0.82rem] ${
          team
            ? isWinner
              ? 'font-bold text-cream'
              : predicted
                ? 'font-medium italic text-cream/45'
                : played
                  ? 'font-medium text-cream/55'
                  : 'font-medium text-cream/90'
            : 'truncate text-xs italic text-cream/40'
        }`}
        title={team ? `${team.name}${predicted ? ' (probable, según posición)' : ''}` : placeholder}
      >
        {team?.name ?? placeholder}
        {predicted && <span className="ml-1 text-[0.6rem] not-italic text-cream/30">prob.</span>}
      </span>
      {isWinner && <Trophy size={12} className="shrink-0 text-gold-300" aria-label="Ganador" />}
      {played && (
        <span className="flex items-baseline gap-1">
          {penalties != null && (
            <sup className="tnum text-[0.6rem] font-semibold text-gold-200/80">({penalties})</sup>
          )}
          <span
            className={`tnum w-5 text-right text-base font-bold tabular-nums ${
              isWinner ? 'text-cream' : 'text-cream/60'
            }`}
          >
            {score ?? '–'}
          </span>
        </span>
      )}
    </div>
  )
}

/** Card de un cruce eliminatorio. Editable cuando ambos equipos están confirmados. */
export function KnockoutMatchCard({ tie, className = '', compact = false }: KnockoutMatchCardProps) {
  const { results, setScore, setPenalties } = useResults()
  const rawEntry = results[tie.id]
  const { match, sourceHome, sourceAway, homeConfirmed, awayConfirmed } = tie
  // Equipos del slot: vienen del tie (resueltos) aunque el partido aún no exista.
  const homeTeam = tie.homeTeam ?? match?.homeTeam ?? null
  const awayTeam = tie.awayTeam ?? match?.awayTeam ?? null
  const live = match ? isLive(match) : false
  const finished = match?.status === 'finished'
  const played = !!match && (finished || live)
  const kickoffUtc = match?.kickoffUtc ?? tie.kickoffUtc
  const stadium = match?.stadium ?? tie.stadium
  const city = match?.city ?? tie.city

  const homeWinner = !!finished && match?.winnerTeamId === homeTeam?.id
  const awayWinner = !!finished && match?.winnerTeamId === awayTeam?.id

  // Editable solo cuando el partido existe (ambos rivales) y ambos confirmados.
  const editable = !!match && !!homeConfirmed && !!awayConfirmed

  return (
    <div
      className={`glass glass-hover relative w-full overflow-hidden p-2.5 ${
        live ? 'ring-1 ring-red-500/30' : ''
      } ${compact ? '' : 'sm:p-3'} ${className}`}
    >
      {live && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        />
      )}
      <div className="space-y-0.5">
        <TeamRow
          team={homeTeam}
          placeholder={sourceHome}
          confirmed={!!homeConfirmed}
          score={match?.homeScore ?? null}
          penalties={match?.penaltiesHome ?? null}
          isWinner={homeWinner}
          played={played && !editable}
        />
        <TeamRow
          team={awayTeam}
          placeholder={sourceAway}
          confirmed={!!awayConfirmed}
          score={match?.awayScore ?? null}
          penalties={match?.penaltiesAway ?? null}
          isWinner={awayWinner}
          played={played && !editable}
        />
      </div>

      {/* Editor de marcador (con penales en caso de empate) */}
      {editable && match && (
        <div className="mt-2 flex justify-center border-t border-white/[0.05] pt-2">
          <ScoreEditor
            size="sm"
            homeScore={rawEntry?.home ?? null}
            awayScore={rawEntry?.away ?? null}
            onChange={(h, a) => setScore(tie.id, h, a)}
            homeLabel={`Goles de ${match.homeTeam?.name ?? 'local'}`}
            awayLabel={`Goles de ${match.awayTeam?.name ?? 'visitante'}`}
            penalties={{
              home: rawEntry?.penaltiesHome ?? null,
              away: rawEntry?.penaltiesAway ?? null,
              onChange: (h, a) => setPenalties(tie.id, h, a),
            }}
          />
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-white/[0.05] px-1 pt-2">
        {match ? (
          <>
            <MatchStatusBadge match={match} />
            <DateTimeArgentina kickoffUtc={kickoffUtc} />
          </>
        ) : (
          <>
            <span className="text-[0.7rem] italic text-cream/40">A definir</span>
            <DateTimeArgentina kickoffUtc={kickoffUtc} />
          </>
        )}
        {stadium && (
          <span className="inline-flex min-w-0 items-center gap-1 text-[0.7rem] text-cream/40">
            <MapPin size={10} className="shrink-0" aria-hidden />
            <span className="truncate">
              {stadium}
              {city ? ` · ${city}` : ''}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
