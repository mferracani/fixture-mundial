import { useEffect, useRef, useState } from 'react'
import { MapPin, X } from 'lucide-react'
import type { Match } from '@/types'
import { isLive } from '@/utils/domain'
import { useResults } from '@/store/results'
import { Flag } from './Flag'
import { MatchStatusBadge } from './MatchStatusBadge'
import { DateTimeArgentina } from './DateTimeArgentina'
import { ScoreEditor } from './ScoreEditor'

interface MatchCardProps {
  match: Match
  /** Permitir cargar/editar el marcador */
  editable?: boolean
  /** Placeholders para cruces eliminatorios sin equipos definidos */
  sourceHome?: string
  sourceAway?: string
  className?: string
}

/** Score con animación breve cuando cambia el valor. */
function Score({ value, highlight }: { value: number | null; highlight: boolean }) {
  const [popped, setPopped] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== null && value !== null && prev.current !== value) {
      setPopped(true)
      const t = setTimeout(() => setPopped(false), 600)
      return () => clearTimeout(t)
    }
    prev.current = value
  }, [value])

  return (
    <span
      className={`tnum text-2xl font-bold leading-none tabular-nums ${
        highlight ? 'text-cream' : 'text-cream/80'
      } ${popped ? 'animate-score-pop' : ''}`}
    >
      {value ?? '–'}
    </span>
  )
}

/**
 * Card de partido premium. Funciona para fase de grupos y eliminatorias.
 * Soporta carga manual de marcador, equipos no definidos, penales, en vivo y
 * finalizado.
 */
export function MatchCard({
  match,
  editable = false,
  sourceHome = 'Por definir',
  sourceAway = 'Por definir',
  className = '',
}: MatchCardProps) {
  const { results, setScore, clearScore } = useResults()
  const rawEntry = results[match.id]
  const live = isLive(match)
  const finished = match.status === 'finished'
  const played = finished || live
  const { homeTeam, awayTeam, homeScore, awayScore, penaltiesHome, penaltiesAway } = match

  const homeWon = finished && match.winnerTeamId === homeTeam?.id
  const awayWon = finished && match.winnerTeamId === awayTeam?.id
  const hasPenalties = penaltiesHome != null && penaltiesAway != null
  const hasStored = homeScore != null || awayScore != null

  return (
    <div
      className={`glass glass-hover group relative overflow-hidden p-3.5 sm:p-4 ${
        live ? 'ring-1 ring-red-500/30' : ''
      } ${className}`}
    >
      {live && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        />
      )}

      {/* Equipos + marcador */}
      <div className="flex items-center gap-3">
        {/* Local */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Flag team={homeTeam} size={24} />
          <span
            className={`min-w-0 flex-1 truncate text-sm ${
              homeTeam
                ? homeWon
                  ? 'font-bold text-cream'
                  : 'font-medium text-cream/90'
                : 'truncate text-xs italic text-cream/40'
            }`}
            title={homeTeam?.name ?? sourceHome}
          >
            {homeTeam?.name ?? sourceHome}
          </span>
        </div>

        {/* Marcador editable / marcador / vs */}
        <div className="flex shrink-0 items-center gap-2 px-1">
          {editable ? (
            <ScoreEditor
              homeScore={rawEntry?.home ?? null}
              awayScore={rawEntry?.away ?? null}
              onChange={(h, a) => setScore(match.id, h, a)}
              homeLabel={`Goles de ${homeTeam?.name ?? 'local'}`}
              awayLabel={`Goles de ${awayTeam?.name ?? 'visitante'}`}
            />
          ) : played ? (
            <>
              <div className="flex items-baseline gap-0.5">
                <Score value={homeScore} highlight={homeWon} />
                {hasPenalties && (
                  <sup className="tnum text-[0.65rem] font-semibold text-gold-200/80">
                    ({penaltiesHome})
                  </sup>
                )}
              </div>
              <span className="text-cream/30">—</span>
              <div className="flex items-baseline gap-0.5">
                {hasPenalties && (
                  <sup className="tnum text-[0.65rem] font-semibold text-gold-200/80">
                    ({penaltiesAway})
                  </sup>
                )}
                <Score value={awayScore} highlight={awayWon} />
              </div>
            </>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-widest text-cream/35">
              vs
            </span>
          )}
        </div>

        {/* Visitante */}
        <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-2.5">
          <Flag team={awayTeam} size={24} />
          <span
            className={`min-w-0 flex-1 truncate text-right text-sm ${
              awayTeam
                ? awayWon
                  ? 'font-bold text-cream'
                  : 'font-medium text-cream/90'
                : 'truncate text-xs italic text-cream/40'
            }`}
            title={awayTeam?.name ?? sourceAway}
          >
            {awayTeam?.name ?? sourceAway}
          </span>
        </div>
      </div>

      {/* Meta: estado + fecha + sede */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/[0.05] pt-2.5">
        <MatchStatusBadge match={match} />
        <DateTimeArgentina kickoffUtc={match.kickoffUtc} />
        {match.stadium && (
          <span className="inline-flex items-center gap-1 text-xs text-cream/45">
            <MapPin size={11} className="shrink-0" aria-hidden />
            <span className="truncate">
              {match.stadium}
              {match.city ? ` · ${match.city}` : ''}
            </span>
          </span>
        )}
        {editable && hasStored && (
          <button
            type="button"
            onClick={() => clearScore(match.id)}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[0.68rem] text-cream/50 transition-colors hover:border-white/25 hover:text-cream/80"
          >
            <X size={11} aria-hidden /> Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
