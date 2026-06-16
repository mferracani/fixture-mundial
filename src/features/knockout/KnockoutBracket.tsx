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

/** Línea/rail sutil entre columnas para dar sensación de bracket. */
function BracketRail({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative hidden w-6 shrink-0 lg:block" aria-hidden>
      <span
        className={`absolute top-1/2 h-px w-full bg-gradient-to-r ${
          flip ? 'from-gold-300/30 to-transparent' : 'from-transparent to-gold-300/30'
        }`}
      />
      <span className="absolute left-1/2 top-[15%] h-[70%] w-px -translate-x-1/2 bg-white/[0.06]" />
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
}: {
  team?: Team | null
  label: string
  showTeam: boolean
}) {
  return (
    <div className="flex h-9 items-center gap-2 border-t border-white/10 px-2">
      {showTeam && team ? (
        <Flag team={team} size={18} />
      ) : (
        <span className="h-[18px] w-[18px] shrink-0 rounded-full bg-white/10" aria-hidden />
      )}
      <span className="min-w-0 truncate text-[0.78rem] font-semibold text-cream/70">
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
      <MobileSlot team={tie.homeTeam} label={showTeams ? tie.sourceHome : 'Por determinar'} showTeam={showTeams} />
      <MobileSlot team={tie.awayTeam} label={showTeams ? tie.sourceAway : 'Por determinar'} showTeam={showTeams} />
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
        <div className="flex min-w-[1120px] items-start gap-3">
          <MobileBracketColumn title="16vos." ties={round32} showTeams />
          <MobileBracketColumn title="8vos." ties={round16} showTeams={false} className="pt-[48px]" />
          <MobileBracketColumn title="CF" ties={quarters} showTeams={false} className="pt-[144px]" />
          <MobileBracketColumn title="SF" ties={semis} showTeams={false} className="pt-[240px]" />
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
            <BracketRail />
            <KnockoutRoundColumn title={ROUND_TITLES.round16} ties={byRoundSide.r16L} className="w-[200px] shrink-0" />
            <BracketRail />
            <KnockoutRoundColumn title={ROUND_TITLES.quarter} ties={byRoundSide.qfL} className="w-[200px] shrink-0" />
            <BracketRail />
            <KnockoutRoundColumn title={ROUND_TITLES.semi} ties={byRoundSide.sfL} className="w-[200px] shrink-0" />

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
            <KnockoutRoundColumn title={ROUND_TITLES.semi} ties={byRoundSide.sfR} align="right" className="w-[200px] shrink-0" />
            <BracketRail flip />
            <KnockoutRoundColumn title={ROUND_TITLES.quarter} ties={byRoundSide.qfR} align="right" className="w-[200px] shrink-0" />
            <BracketRail flip />
            <KnockoutRoundColumn title={ROUND_TITLES.round16} ties={byRoundSide.r16R} align="right" className="w-[200px] shrink-0" />
            <BracketRail flip />
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
