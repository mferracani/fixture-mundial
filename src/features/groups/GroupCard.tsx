import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Group } from '@/types'
import {
  GROUP_STATUS_LABELS,
  groupStatus,
  groupHasLive,
  matchesFilter,
  type MatchFilter,
} from '@/utils/domain'
import { StatusBadge } from '@/components/StatusBadge'
import { LiveIndicator } from '@/components/LiveIndicator'
import { StandingsTable } from '@/components/StandingsTable'
import { MatchCard } from '@/components/MatchCard'

interface GroupCardProps {
  group: Group
  defaultOpen?: boolean
  filter: MatchFilter
  highlightTeamId?: string | null
}

export function GroupCard({
  group,
  defaultOpen = false,
  filter,
  highlightTeamId,
}: GroupCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const status = groupStatus(group)
  const hasLive = groupHasLive(group)
  const visibleMatches = group.matches.filter((m) => matchesFilter(m, filter))

  const statusBadge =
    status === 'playing' && hasLive ? (
      <LiveIndicator />
    ) : (
      <StatusBadge tone={status === 'decided' ? 'green' : status === 'playing' ? 'sky' : 'neutral'}>
        {GROUP_STATUS_LABELS[status]}
      </StatusBadge>
    )

  const panelId = `group-panel-${group.id}`

  return (
    <section
      className={`glass overflow-hidden transition-shadow duration-300 ${
        hasLive ? 'shadow-[0_0_0_1px_rgba(239,68,68,0.25),0_18px_50px_-20px_rgba(239,68,68,0.35)]' : ''
      }`}
      aria-labelledby={`group-h-${group.id}`}
    >
      {/* Header (toggle) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-white/[0.02] sm:p-5"
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
              hasLive
                ? 'bg-red-500/15 text-red-200'
                : 'bg-gold-gradient text-night-950 shadow-gold-glow'
            }`}
            aria-hidden
          >
            {group.id}
          </span>
          <div>
            <h3 id={`group-h-${group.id}`} className="font-display text-base font-bold text-cream">
              {group.name}
            </h3>
            <p className="text-xs text-cream/45">
              {group.teams.length} equipos · {group.matches.length} partidos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {statusBadge}
          <ChevronDown
            size={18}
            aria-hidden
            className={`shrink-0 text-cream/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-4 pb-5 pt-4 sm:px-5">
              <StandingsTable
                standings={group.standings}
                teams={group.teams}
                highlightTeamId={highlightTeamId}
              />

              {/* Leyenda */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.68rem] text-cream/45">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-pitch-500" aria-hidden />
                  Clasifica directo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-gold-400/80" aria-hidden />
                  Entra como mejor tercero
                </span>
              </div>

              {/* Partidos */}
              <div className="mt-5">
                <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-cream/40">
                  Partidos
                </h4>
                {visibleMatches.length > 0 ? (
                  <div className="grid gap-2.5">
                    {visibleMatches.map((m) => (
                      <MatchCard key={m.id} match={m} editable />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center text-sm text-cream/40">
                    No hay partidos para este filtro.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
