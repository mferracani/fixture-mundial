import { CalendarDays } from 'lucide-react'
import type { Group, KnockoutTie, Match } from '@/types'
import { EmptyState } from '@/components/EmptyState'
import { MatchCard } from '@/components/MatchCard'
import { isUpcoming } from '@/utils/domain'

interface UpcomingMatchesViewProps {
  groups: Group[]
  knockout: KnockoutTie[]
}

interface UpcomingMatchItem {
  id: string
  match: Match
  sourceHome?: string
  sourceAway?: string
}

function tieToMatch(tie: KnockoutTie): Match | null {
  if (tie.match) return tie.match
  if (!tie.kickoffUtc) return null

  return {
    id: tie.id,
    stage: tie.round,
    round: tie.sourceHome.includes('dieciseisavos') ? 'Octavos' : undefined,
    homeTeam: tie.homeTeam ?? null,
    awayTeam: tie.awayTeam ?? null,
    homeScore: null,
    awayScore: null,
    penaltiesHome: null,
    penaltiesAway: null,
    status: 'scheduled',
    minute: null,
    kickoffUtc: tie.kickoffUtc,
    stadium: tie.stadium,
    city: tie.city,
    winnerTeamId: null,
  }
}

function compareKickoff(a: UpcomingMatchItem, b: UpcomingMatchItem) {
  const aTime = a.match.kickoffUtc ? Date.parse(a.match.kickoffUtc) : Number.MAX_SAFE_INTEGER
  const bTime = b.match.kickoffUtc ? Date.parse(b.match.kickoffUtc) : Number.MAX_SAFE_INTEGER
  return aTime - bTime
}

export function UpcomingMatchesView({ groups, knockout }: UpcomingMatchesViewProps) {
  const groupMatches: UpcomingMatchItem[] = groups.flatMap((group) =>
    group.matches.filter(isUpcoming).map((match) => ({ id: match.id, match })),
  )

  const knockoutMatches: UpcomingMatchItem[] = knockout
    .map((tie) => {
      const match = tieToMatch(tie)
      if (!match || !isUpcoming(match)) return null
      return {
        id: tie.id,
        match,
        sourceHome: tie.sourceHome,
        sourceAway: tie.sourceAway,
      }
    })
    .filter(Boolean) as UpcomingMatchItem[]

  const matches = [...groupMatches, ...knockoutMatches].sort(compareKickoff)

  if (matches.length === 0) {
    return (
      <EmptyState
        title="No hay próximos partidos."
        description="Cuando haya partidos programados, van a aparecer ordenados por fecha y hora."
      />
    )
  }

  return (
    <section aria-labelledby="upcoming-title" className="space-y-4">
      <div className="flex items-center gap-2 text-cream/75">
        <CalendarDays size={18} className="text-gold-200/80" aria-hidden />
        <h2 id="upcoming-title" className="font-display text-lg font-bold text-cream">
          Próximos partidos
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((item) => (
          <MatchCard
            key={item.id}
            match={item.match}
            sourceHome={item.sourceHome}
            sourceAway={item.sourceAway}
          />
        ))}
      </div>
    </section>
  )
}
