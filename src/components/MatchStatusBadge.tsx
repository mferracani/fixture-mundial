import { CalendarClock, CheckCircle2, PauseCircle, AlertTriangle } from 'lucide-react'
import type { Match } from '@/types'
import { STATUS_LABELS } from '@/utils/domain'
import { StatusBadge } from './StatusBadge'
import { LiveIndicator } from './LiveIndicator'

/** Badge específico para el estado de un partido. */
export function MatchStatusBadge({ match }: { match: Match }) {
  switch (match.status) {
    case 'live':
      return <LiveIndicator minute={match.minute} />
    case 'halftime':
      return <LiveIndicator halftime />
    case 'finished':
      return (
        <StatusBadge tone="green" icon={<CheckCircle2 size={12} />}>
          {STATUS_LABELS.finished}
        </StatusBadge>
      )
    case 'postponed':
      return (
        <StatusBadge tone="neutral" icon={<PauseCircle size={12} />}>
          {STATUS_LABELS.postponed}
        </StatusBadge>
      )
    case 'suspended':
      return (
        <StatusBadge tone="live" icon={<AlertTriangle size={12} />}>
          {STATUS_LABELS.suspended}
        </StatusBadge>
      )
    case 'scheduled':
    default:
      return (
        <StatusBadge tone="sky" icon={<CalendarClock size={12} />}>
          {STATUS_LABELS.scheduled}
        </StatusBadge>
      )
  }
}
