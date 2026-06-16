import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import type { KnockoutTie, Stage } from '@/types'
import { KnockoutRoundColumn } from './KnockoutRoundColumn'
import { KnockoutMatchCard } from './KnockoutMatchCard'
import { TrophyCenterpiece } from '@/components/TrophyCenterpiece'

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

const MOBILE_TABS: { stage: Stage; short: string }[] = [
  { stage: 'round32', short: 'R32' },
  { stage: 'round16', short: 'Octavos' },
  { stage: 'quarter', short: 'Cuartos' },
  { stage: 'semi', short: 'Semis' },
  { stage: 'final', short: 'Final' },
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

export function KnockoutBracket({ ties }: KnockoutBracketProps) {
  const [activeTab, setActiveTab] = useState<Stage>('round32')

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

  const mobileTies = useMemo(() => {
    if (activeTab === 'final') {
      return [...byRoundSide.final, ...byRoundSide.third]
    }
    return ties
      .filter((t) => t.round === activeTab)
      .sort((a, b) => (a.side === b.side ? a.position - b.position : a.side === 'left' ? -1 : 1))
  }, [activeTab, ties, byRoundSide])

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
        {/* Trofeo + camino del campeón (mini) */}
        <div className="mb-6 flex flex-col items-center">
          <TrophyCenterpiece size={120} />
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gold-300/30 bg-gold-300/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-100">
            <Crown size={12} aria-hidden /> Camino al campeón
          </span>
        </div>

        {/* Tabs de fase */}
        <div
          role="tablist"
          aria-label="Fase de eliminatorias"
          className="scroll-elegant -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          {MOBILE_TABS.map((t) => (
            <button
              key={t.stage}
              role="tab"
              aria-selected={activeTab === t.stage}
              type="button"
              onClick={() => setActiveTab(t.stage)}
              className={`chip shrink-0 ${activeTab === t.stage ? 'chip-active' : ''}`}
            >
              {t.short}
            </button>
          ))}
        </div>

        {/* Cards de la fase activa */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-3"
        >
          {mobileTies.length > 0 ? (
            mobileTies.map((tie) => (
              <div key={tie.id}>
                {tie.round === 'third' && (
                  <h4 className="mb-1.5 mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-cream/40">
                    Tercer puesto
                  </h4>
                )}
                {tie.round === 'final' && (
                  <h4 className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-gold-200/70">
                    Final
                  </h4>
                )}
                <KnockoutMatchCard
                  tie={tie}
                  className={tie.round === 'final' ? 'ring-1 ring-gold-300/20' : ''}
                />
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-8 text-center text-sm text-cream/40">
              Todavía no hay cruces definidos para esta fase.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
