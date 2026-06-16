import { useMemo } from 'react'
import { Info } from 'lucide-react'
import type { Group } from '@/types'
import {
  groupMatchesSearch,
  matchesFilter,
  normalize,
  type MatchFilter,
} from '@/utils/domain'
import { GroupCard } from './GroupCard'
import { EmptyState } from '@/components/EmptyState'

interface GroupsViewProps {
  groups: Group[]
  filter: MatchFilter
  search: string
}

export function GroupsView({ groups, filter, search }: GroupsViewProps) {
  // Equipo resaltado si la búsqueda matchea un país puntual.
  const highlightTeamId = useMemo(() => {
    if (!search) return null
    const q = normalize(search)
    for (const g of groups) {
      const t = g.teams.find(
        (t) => normalize(t.name).includes(q) || normalize(t.shortName).includes(q),
      )
      if (t) return t.id
    }
    return null
  }, [groups, search])

  const visibleGroups = useMemo(() => {
    return groups
      .filter((g) => groupMatchesSearch(g, search))
      .filter((g) => {
        // Si hay filtro de estado activo, ocultar grupos sin partidos en ese estado.
        if (filter === 'all') return true
        return g.matches.some((m) => matchesFilter(m, filter))
      })
  }, [groups, search, filter])

  if (visibleGroups.length === 0) {
    return (
      <EmptyState
        title="No encontramos grupos para tu búsqueda."
        description="Probá con otro país o limpiá los filtros."
      />
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleGroups.map((g) => (
          // Todos los grupos abiertos por defecto para que siempre se vea su
          // tabla y sus partidos. El usuario igual puede colapsarlos.
          <GroupCard
            key={g.id}
            group={g}
            defaultOpen
            filter={filter}
            highlightTeamId={highlightTeamId}
          />
        ))}
      </div>

      <section className="glass px-4 py-3.5 sm:px-5" aria-labelledby="third-place-rules-title">
        <div className="flex gap-3">
          <Info size={18} className="mt-0.5 shrink-0 text-gold-200/80" aria-hidden />
          <div>
            <h3 id="third-place-rules-title" className="text-sm font-semibold text-cream">
              Terceros puestos
            </h3>
            <p className="mt-1 text-sm leading-6 text-cream/60">
              Clasifican los dos primeros de cada grupo y los ocho mejores terceros. El ranking de
              terceros se ordena por puntos, diferencia de gol y goles a favor; si siguiera empatado,
              FIFA define por conducta deportiva y sorteo. En cada grupo, el tercero marcado en dorado
              es el que hoy entraria entre los ocho mejores.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
