import { useMemo } from 'react'
import { Crown, Trophy } from 'lucide-react'
import type { KnockoutTie, Stage, Team } from '@/types'
import { KnockoutRoundColumn } from './KnockoutRoundColumn'
import { KnockoutMatchCard } from './KnockoutMatchCard'
import { TrophyCenterpiece } from '@/components/TrophyCenterpiece'
import { Flag } from '@/components/Flag'
import { formatDayArgentina, formatTimeArgentina } from '@/utils/date'

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
  return (
    <span>
      {formatDayArgentina(tie.kickoffUtc)} · {formatTimeArgentina(tie.kickoffUtc)}
    </span>
  )
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

function MobileBracketTie({
  tie,
  showTeams,
  className = '',
}: {
  tie: KnockoutTie
  showTeams: boolean
  className?: string
}) {
  return (
    <article
      className={`relative h-[96px] overflow-hidden rounded-xl border border-white/10 bg-night-900/80 shadow-glass ${className}`}
    >
      <div className="flex h-6 items-center px-2 text-[0.68rem] font-semibold text-cream/45">
        <MobileTieDate tie={tie} />
      </div>
      <MobileSlot
        team={tie.homeTeam}
        label={showTeams ? tie.sourceHome : 'Por determinar'}
        showTeam={showTeams}
        confirmed={tie.homeConfirmed}
      />
      <MobileSlot
        team={tie.awayTeam}
        label={showTeams ? tie.sourceAway : 'Por determinar'}
        showTeam={showTeams}
        confirmed={tie.awayConfirmed}
      />
    </article>
  )
}

function MobileBracketColumn({
  title,
  ties,
  showTeams,
  className = '',
}: {
  title: string
  ties: KnockoutTie[]
  showTeams: boolean
  className?: string
}) {
  return (
    <div className={`w-[270px] shrink-0 ${className}`}>
      <h3 className="mb-2 text-center text-xs font-bold text-cream/75">{title}</h3>
      <div className="space-y-4">
        {ties.map((tie) => (
          <MobileBracketTie key={tie.id} tie={tie} showTeams={showTeams} />
        ))}
      </div>
    </div>
  )
}

const MOBILE_TIE_HEIGHT = 96
const MOBILE_TIE_GAP = 16
const MOBILE_TIE_STEP = MOBILE_TIE_HEIGHT + MOBILE_TIE_GAP
const MOBILE_TIE_MIDPOINT = MOBILE_TIE_HEIGHT / 2

function MobileConnectorRail({
  sourceCount,
  targetCount,
  sourceOffset = 0,
  targetOffset = 0,
}: {
  sourceCount: number
  targetCount: number
  sourceOffset?: number
  targetOffset?: number
}) {
  const visibleSourceCount = Math.min(sourceCount, targetCount * 2)
  const height =
    Math.max(
      sourceOffset + Math.max(sourceCount - 1, 0) * MOBILE_TIE_STEP + MOBILE_TIE_HEIGHT,
      targetOffset + Math.max(targetCount - 1, 0) * MOBILE_TIE_STEP + MOBILE_TIE_HEIGHT,
    ) + 8

  return (
    <svg
      className="mt-8 w-10 shrink-0 overflow-visible"
      width="40"
      height={height}
      viewBox={`0 0 40 ${height}`}
      fill="none"
      aria-hidden
    >
      {Array.from({ length: visibleSourceCount }, (_, sourceIndex) => {
        const targetIndex = Math.floor(sourceIndex / 2)
        const sourceY = sourceOffset + sourceIndex * MOBILE_TIE_STEP + MOBILE_TIE_MIDPOINT
        const targetY = targetOffset + targetIndex * MOBILE_TIE_STEP + MOBILE_TIE_MIDPOINT
        const busX = sourceIndex % 2 === 0 ? 20 : 26

        return (
          <path
            key={sourceIndex}
            d={`M0 ${sourceY} H${busX} V${targetY} H40`}
            stroke="rgb(250 218 113 / 0.38)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      })}
      {Array.from({ length: targetCount }, (_, targetIndex) => {
        const targetY = targetOffset + targetIndex * MOBILE_TIE_STEP + MOBILE_TIE_MIDPOINT

        return (
          <circle
            key={targetIndex}
            cx="40"
            cy={targetY}
            r="2"
            fill="rgb(250 218 113 / 0.55)"
          />
        )
      })}
    </svg>
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
        <div className="flex min-w-[1280px] items-start">
          <MobileBracketColumn title="16vos." ties={round32} showTeams />
          <MobileConnectorRail
            sourceCount={round32.length}
            targetCount={round16.length}
            targetOffset={48}
          />
          <MobileBracketColumn title="8vos." ties={round16} showTeams={false} className="pt-[48px]" />
          <MobileConnectorRail
            sourceCount={round16.length}
            targetCount={quarters.length}
            sourceOffset={48}
            targetOffset={144}
          />
          <MobileBracketColumn title="CF" ties={quarters} showTeams={false} className="pt-[144px]" />
          <MobileConnectorRail
            sourceCount={quarters.length}
            targetCount={semis.length}
            sourceOffset={144}
            targetOffset={240}
          />
          <MobileBracketColumn title="SF" ties={semis} showTeams={false} className="pt-[240px]" />
          <MobileConnectorRail
            sourceCount={semis.length}
            targetCount={final.length}
            sourceOffset={240}
            targetOffset={336}
          />
          <MobileBracketColumn title="Final" ties={final} showTeams={false} className="pt-[336px]" />
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
