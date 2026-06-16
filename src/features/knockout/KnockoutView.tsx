import type { KnockoutTie } from '@/types'
import { KnockoutBracket } from './KnockoutBracket'
import { EmptyState } from '@/components/EmptyState'

export function KnockoutView({ ties }: { ties: KnockoutTie[] }) {
  if (!ties || ties.length === 0) {
    return (
      <EmptyState description="Las eliminatorias se definirán al cerrar la fase de grupos." />
    )
  }
  return <KnockoutBracket ties={ties} />
}
