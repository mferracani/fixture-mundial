import { useMemo } from 'react'
import { Crown, Trophy } from 'lucide-react'
import type { KnockoutTie, Stage, Team } from '@/types'
import { KnockoutRoundColumn } from './KnockoutRoundColumn'
import { KnockoutMatchCard } from './KnockoutMatchCard'
import { TrophyCenterpiece } from '@/components/TrophyCenterpiece'
import { Flag } from '@/components/Flag'
import { formatKickoffArgentina } from '@/utils/date'
import { BRACKET } from '@/utils/bracket'

interface KnockoutBracketProps {
  ties: KnockoutTie[]
}

const ROUND_TITLES: Record<Stage, string> = {
  group: 'Grupos',
  round32: 'Dieciseisavos',
  round16: 'Octavos',
  quarter: 'Cuartos',
  semi: 'Semifinales',
  third: 'Tercer puesto',
  final: 'Final',
}

const MOBILE_STAGES: { stage: Stage; short: string }[] = [
  { stage: 'group', short: 'FG' },
  { stage: 'round32', short: '16vos.' },
  { stage: 'round16', short: '8vos.' },
  { stage: 'quarter', short: 'CF' },
  { stage: 'semi', short: 'SF' },
  { stage: 'final', short: 'F' },
]

/** Conector real entre fases del bracket desktop. */
function DesktopConnectorRail({
  sourceCount,
  targetCount,
  flip = false,
}: {
  sourceCount: number
  targetCount: number
  flip?: boolean
}) {
  const visibleSourceCount = Math.min(sourceCount, targetCount * 2)
  const centerY = (index: number, count: number) => ((index + 0.5) / count) * 100
  const sourceX = flip ? 36 : 0
  const targetX = flip ? 0 : 36

  return (
    <div className="relative hidden w-9 shrink-0 self-stretch pb-2 pt-8 lg:block" aria-hidden>
      <svg
        className="h-full w-full overflow-visible"
        viewBox="0 0 36 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {Array.from({ length: visibleSourceCount }, (_, sourceIndex) => {
          const targetIndex = Math.floor(sourceIndex / 2)
          const sourceY = centerY(sourceIndex, sourceCount)
          const targetY = centerY(targetIndex, targetCount)
          const busX = flip ? (sourceIndex % 2 === 0 ? 15 : 10) : sourceIndex % 2 === 0 ? 21 : 26

          return (
            <path
              key={sourceIndex}
              d={`M${sourceX} ${sourceY} H${busX} V${targetY} H${targetX}`}
              stroke="rgb(250 218 113 / 0.42)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
        {Array.from({ length: targetCount }, (_, targetIndex) => (
          <circle
            key={targetIndex}
            cx={targetX}
            cy={centerY(targetIndex, targetCount)}
            r="2"
            fill="rgb(250 218 113 / 0.6)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  )
}

function MobileTieDate({ tie }: { tie: KnockoutTie }) {
  if (!tie.kickoffUtc) {
    return <span>Fecha a confirmar</span>
  }
  // Mismo formato que el resto de la app: hora de Argentina por defecto y, para
  // los partidos del 24/6 al 12/7, la hora de España entre paréntesis.
  return <span className="truncate">{formatKickoffArgentina(tie.kickoffUtc)}</span>
}

function MobileSlot({
  team,
  label,
  showTeam,
  confirmed = false,
}: {
  team?: Team | null
  label: string
  showTeam: boolean
  confirmed?: boolean
}) {
  const predicted = showTeam && !!team && !confirmed

  return (
    <div className="flex h-9 items-center gap-2 border-t border-white/10 px-2">
      {showTeam && team ? (
        <Flag team={team} size={18} className={predicted ? 'grayscale opacity-45' : ''} />
      ) : (
        <span className="h-[18px] w-[18px] shrink-0 rounded-full bg-white/10" aria-hidden />
      )}
      <span
        className={`min-w-0 truncate text-[0.78rem] font-semibold ${
          predicted ? 'text-cream/35' : 'text-cream/70'
        }`}
      >
        {showTeam && team ? team.shortName : label}
      </span>
    </div>
  )
}

function MobileTeamToken({ team, muted = true }: { team: Team; muted?: boolean }) {
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1 rounded-full bg-white/[0.04] px-1.5 py-1 ${
        muted ? 'text-cream/45' : 'text-cream/75'
      }`}
      title={team.name}
    >
      <Flag team={team} size={14} className={muted ? 'grayscale opacity-55' : ''} />
      <span className="max-w-[52px] truncate text-[0.64rem] font-semibold">{team.shortName}</span>
    </span>
  )
}

function MobileTeamVs({ home, away }: { home: Team | null; away: Team | null }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      {home ? (
        <MobileTeamToken team={home} />
      ) : (
        <span className="h-5 w-12 rounded-full bg-white/[0.04]" aria-hidden />
      )}
      <span className="text-[0.58rem] font-bold uppercase text-gold-200/45">vs</span>
      {away ? (
        <MobileTeamToken team={away} />
      ) : (
        <span className="h-5 w-12 rounded-full bg-white/[0.04]" aria-hidden />
      )}
    </div>
  )
}

function MobileCandidateBlock({
  sourceTie,
  candidates,
}: {
  sourceTie: KnockoutTie | null
  candidates: Team[]
}) {
  if (sourceTie?.homeTeam || sourceTie?.awayTeam) {
    return (
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1.5">
        <MobileTeamVs home={sourceTie.homeTeam ?? null} away={sourceTie.awayTeam ?? null} />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1.5">
      <div className="mb-1 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-cream/30">
        Posibles
      </div>
      <div className="flex flex-wrap gap-1">
        {candidates.slice(0, 8).map((team) => (
          <MobileTeamToken key={team.id} team={team} />
        ))}
        {candidates.length > 8 && (
          <span className="inline-flex items-center rounded-full bg-white/[0.04] px-1.5 py-1 text-[0.64rem] font-semibold text-cream/35">
            +{candidates.length - 8}
          </span>
        )}
      </div>
    </div>
  )
}

function MobilePossibleSources({
  tie,
  tiesById,
  sourceIdsByTieId,
}: {
  tie: KnockoutTie
  tiesById: Map<string, KnockoutTie>
  sourceIdsByTieId: Map<string, string[]>
}) {
  const getCandidates = (tieId: string, seen = new Set<string>()): Team[] => {
    if (seen.has(tieId)) return []
    seen.add(tieId)

    const sourceTie = tiesById.get(tieId)
    if (!sourceTie) return []

    const directTeams = [sourceTie.homeTeam, sourceTie.awayTeam].filter(Boolean) as Team[]
    if (directTeams.length > 0) return directTeams

    const childIds = sourceIdsByTieId.get(tieId) ?? []
    const byId = new Map<string, Team>()
    for (const childId of childIds) {
      for (const team of getCandidates(childId, seen)) {
        byId.set(team.id, team)
      }
    }
    return [...byId.values()]
  }

  const sourceIds = sourceIdsByTieId.get(tie.id) ?? []
  if (sourceIds.length === 0) {
    return (
      <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-2 text-xs italic text-cream/35">
        Por determinar
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-1.5">
      {sourceIds.map((sourceId, index) => {
        const sourceTie = tiesById.get(sourceId) ?? null
        const candidates = getCandidates(sourceId)

        return (
          <div key={sourceId}>
            {index === 1 && (
              <div className="my-1 text-center text-[0.58rem] font-bold uppercase text-gold-200/45">
                vs
              </div>
            )}
            <MobileCandidateBlock sourceTie={sourceTie} candidates={candidates} />
          </div>
        )
      })}
    </div>
  )
}

function MobileBracketTie({
  tie,
  showTeams,
  tiesById,
  sourceIdsByTieId,
  className = '',
}: {
  tie: KnockoutTie
  showTeams: boolean
  tiesById: Map<string, KnockoutTie>
  sourceIdsByTieId: Map<string, string[]>
  className?: string
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-night-900/80 shadow-glass ${
        showTeams ? 'h-[96px]' : 'min-h-[126px] p-2'
      } ${className}`}
    >
      <div
        className={`flex h-6 items-center text-[0.68rem] font-semibold text-cream/45 ${
          showTeams ? 'px-2' : 'px-0'
        }`}
      >
        <MobileTieDate tie={tie} />
      </div>
      {showTeams ? (
        <>
          <MobileSlot
            team={tie.homeTeam}
            label={tie.sourceHome}
            showTeam
            confirmed={tie.homeConfirmed}
          />
          <MobileSlot
            team={tie.awayTeam}
            label={tie.sourceAway}
            showTeam
            confirmed={tie.awayConfirmed}
          />
        </>
      ) : (
        <MobilePossibleSources
          tie={tie}
          tiesById={tiesById}
          sourceIdsByTieId={sourceIdsByTieId}
        />
      )}
    </article>
  )
}

function MobileBracketColumn({
  title,
  ties,
  showTeams,
  tiesById,
  sourceIdsByTieId,
  className = '',
}: {
  title: string
  ties: KnockoutTie[]
  showTeams: boolean
  tiesById: Map<string, KnockoutTie>
  sourceIdsByTieId: Map<string, string[]>
  className?: string
}) {
  return (
    <div className={`w-[270px] shrink-0 ${className}`}>
      <h3 className="mb-2 text-center text-xs font-bold text-cream/75">{title}</h3>
      <div className="space-y-4">
        {ties.map((tie) => (
          <MobileBracketTie
            key={tie.id}
            tie={tie}
            showTeams={showTeams}
            tiesById={tiesById}
            sourceIdsByTieId={sourceIdsByTieId}
          />
        ))}
      </div>
    </div>
  )
}

function MobileKnockoutBracket({ ties }: { ties: KnockoutTie[] }) {
  const pick = (round: Stage) =>
    ties.filter((t) => t.round === round).sort((a, b) => a.position - b.position)

  const round32 = pick('round32')
  const round16 = pick('round16')
  const quarters = pick('quarter')
  const semis = pick('semi')
  const final = pick('final')
  const tiesById = new Map(ties.map((tie) => [tie.id, tie]))
  const sourceIdsByTieId = new Map(
    BRACKET.map((def) => [
      def.id,
      [def.home, def.away]
        .filter((slot) => slot.kind === 'winnerOf' || slot.kind === 'loserOf')
        .map((slot) => ('tieId' in slot ? slot.tieId : '')),
    ]),
  )

  return (
    <div className="-mx-4 sm:-mx-5">
      <div className="mb-5 flex flex-col items-center px-4">
        <TrophyCenterpiece size={70} />
        <h2 className="mt-2 text-center font-display text-lg font-bold text-cream">
          Copa Mundial de la FIFA 2026
        </h2>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-6 text-center text-sm font-semibold text-cream/45">
          {MOBILE_STAGES.map((stage) => (
            <span
              key={stage.stage}
              className={stage.stage === 'round32' || stage.stage === 'round16' ? 'text-cream' : ''}
            >
              {stage.short}
            </span>
          ))}
        </div>

        <div className="mt-2 flex h-[60px] items-center overflow-hidden rounded-xl border border-white/10 bg-night-900/70">
          <div className="grid h-full flex-1 grid-cols-6">
            {MOBILE_STAGES.map((stage) => (
              <div
                key={stage.stage}
                className={`flex items-center justify-center border-r border-white/[0.05] last:border-r-0 ${
                  stage.stage === 'round32' || stage.stage === 'round16'
                    ? 'bg-white/10 text-cream'
                    : 'text-cream/35'
                }`}
                aria-hidden
              >
                {stage.stage === 'final' ? (
                  <Trophy size={18} />
                ) : (
                  <span className="h-px w-7 rounded-full bg-current" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-elegant mt-5 overflow-x-auto px-4 pb-4">
        <div className="flex min-w-[1420px] items-start gap-4">
          <MobileBracketColumn
            title="16vos."
            ties={round32}
            showTeams
            tiesById={tiesById}
            sourceIdsByTieId={sourceIdsByTieId}
          />
          <MobileBracketColumn
            title="8vos."
            ties={round16}
            showTeams={false}
            tiesById={tiesById}
            sourceIdsByTieId={sourceIdsByTieId}
          />
          <MobileBracketColumn
            title="CF"
            ties={quarters}
            showTeams={false}
            tiesById={tiesById}
            sourceIdsByTieId={sourceIdsByTieId}
          />
          <MobileBracketColumn
            title="SF"
            ties={semis}
            showTeams={false}
            tiesById={tiesById}
            sourceIdsByTieId={sourceIdsByTieId}
          />
          <MobileBracketColumn
            title="Final"
            ties={final}
            showTeams={false}
            tiesById={tiesById}
            sourceIdsByTieId={sourceIdsByTieId}
          />
        </div>
      </div>
    </div>
  )
}

export function KnockoutBracket({ ties }: KnockoutBracketProps) {
  const byRoundSide = useMemo(() => {
    const pick = (round: Stage, side?: 'left' | 'right') =>
      ties
        .filter((t) => t.round === round && (side ? t.side === side : true))
        .sort((a, b) => a.position - b.position)
    return {
      r32L: pick('round32', 'left'),
      r32R: pick('round32', 'right'),
      r16L: pick('round16', 'left'),
      r16R: pick('round16', 'right'),
      qfL: pick('quarter', 'left'),
      qfR: pick('quarter', 'right'),
      sfL: pick('semi', 'left'),
      sfR: pick('semi', 'right'),
      third: pick('third'),
      final: pick('final'),
    }
  }, [ties])

  const finalTie = byRoundSide.final[0]
  const thirdTie = byRoundSide.third[0]

  return (
    <div>
      {/* ===================== DESKTOP (lg+) ===================== */}
      <div className="hidden lg:block">
        <div className="scroll-elegant overflow-x-auto pb-4">
          <div className="flex min-w-[1180px] items-stretch gap-1 px-1">
            {/* Lado izquierdo */}
            <KnockoutRoundColumn title={ROUND_TITLES.round32} ties={byRoundSide.r32L} className="w-[200px] shrink-0" />
            <DesktopConnectorRail sourceCount={byRoundSide.r32L.length} targetCount={byRoundSide.r16L.length} />
            <KnockoutRoundColumn title={ROUND_TITLES.round16} ties={byRoundSide.r16L} className="w-[200px] shrink-0" />
            <DesktopConnectorRail sourceCount={byRoundSide.r16L.length} targetCount={byRoundSide.qfL.length} />
            <KnockoutRoundColumn title={ROUND_TITLES.quarter} ties={byRoundSide.qfL} className="w-[200px] shrink-0" />
            <DesktopConnectorRail sourceCount={byRoundSide.qfL.length} targetCount={byRoundSide.sfL.length} />
            <KnockoutRoundColumn title={ROUND_TITLES.semi} ties={byRoundSide.sfL} className="w-[200px] shrink-0" />
            <DesktopConnectorRail sourceCount={byRoundSide.sfL.length} targetCount={byRoundSide.final.length} />

            {/* Centro: trofeo + final */}
            <div className="flex min-w-[260px] flex-1 flex-col items-center justify-center px-2">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold-300/30 bg-gold-300/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-100">
                <Crown size={12} aria-hidden /> Camino al campeón
              </span>
              <TrophyCenterpiece size={172} className="my-1" />
              <div className="w-full max-w-[260px]">
                <h3 className="mb-2 text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-gold-gradient">
                  Final
                </h3>
                {finalTie ? (
                  <KnockoutMatchCard tie={finalTie} className="shadow-glass-lg ring-1 ring-gold-300/20" />
                ) : null}
                {thirdTie && (
                  <div className="mt-3">
                    <h4 className="mb-1.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-cream/40">
                      Tercer puesto
                    </h4>
                    <KnockoutMatchCard tie={thirdTie} compact />
                  </div>
                )}
              </div>
            </div>

            {/* Lado derecho (espejo) */}
            <DesktopConnectorRail sourceCount={byRoundSide.sfR.length} targetCount={byRoundSide.final.length} flip />
            <KnockoutRoundColumn title={ROUND_TITLES.semi} ties={byRoundSide.sfR} align="right" className="w-[200px] shrink-0" />
            <DesktopConnectorRail sourceCount={byRoundSide.qfR.length} targetCount={byRoundSide.sfR.length} flip />
            <KnockoutRoundColumn title={ROUND_TITLES.quarter} ties={byRoundSide.qfR} align="right" className="w-[200px] shrink-0" />
            <DesktopConnectorRail sourceCount={byRoundSide.r16R.length} targetCount={byRoundSide.qfR.length} flip />
            <KnockoutRoundColumn title={ROUND_TITLES.round16} ties={byRoundSide.r16R} align="right" className="w-[200px] shrink-0" />
            <DesktopConnectorRail sourceCount={byRoundSide.r32R.length} targetCount={byRoundSide.r16R.length} flip />
            <KnockoutRoundColumn title={ROUND_TITLES.round32} ties={byRoundSide.r32R} align="right" className="w-[200px] shrink-0" />
          </div>
        </div>
      </div>

      {/* ===================== MOBILE / TABLET (<lg) ===================== */}
      <div className="lg:hidden">
        <MobileKnockoutBracket ties={ties} />
      </div>
    </div>
  )
}
