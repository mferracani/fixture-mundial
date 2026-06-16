import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Info, RotateCcw } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { HeroHeader } from '@/components/HeroHeader'
import { FilterBar } from '@/components/FilterBar'
import { SearchInput } from '@/components/SearchInput'
import { SkeletonGrid } from '@/components/SkeletonCard'
import { ErrorState } from '@/components/ErrorState'
import type { Section } from '@/components/TopNavigation'
import { GroupsView } from '@/features/groups/GroupsView'
import { UpcomingMatchesView } from '@/features/groups/UpcomingMatchesView'
import { KnockoutView } from '@/features/knockout/KnockoutView'
import { useWorldCupData } from '@/hooks/useWorldCupData'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useResults } from '@/store/results'
import { buildFixtureView } from '@/utils/fixture'
import { countByState, type MatchFilter } from '@/utils/domain'

export default function App() {
  const [section, setSection] = useState<Section>('groups')
  const [filter, setFilter] = useState<MatchFilter>('all')
  const [search, setSearch] = useState('')

  const online = useOnlineStatus()
  const { data, isLoading, isError, isFetching, refetch, source } = useWorldCupData()
  const { results, clearAll } = useResults()

  // Vista derivada: aplica los resultados cargados, recalcula posiciones (reglas
  // FIFA) y resuelve el bracket (equipos probables / confirmados).
  const view = useMemo(
    () => (data ? buildFixtureView(data, results) : undefined),
    [data, results],
  )

  const counts = useMemo(() => countByState(view), [view])
  const resultsCount = Object.keys(results).length
  const showUpcoming = section === 'groups' && filter === 'upcoming'

  const handleSectionChange = (nextSection: Section) => {
    setSection(nextSection)
    if (nextSection !== 'groups') setFilter('all')
  }

  return (
    <AppShell section={section} onSectionChange={handleSectionChange} offline={!online}>
      <HeroHeader
        lastUpdatedUtc={data?.lastUpdatedUtc}
        liveCount={counts.live}
        upcomingCount={counts.upcoming}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        source={source}
      />

      {/* Nota: cargá los resultados vos mismo; se guardan en tu navegador */}
      {source === 'mock' && (
        <div className="mt-6 hidden flex-col gap-2 rounded-xl border border-sky2-400/20 bg-sky2-400/[0.07] px-4 py-3 text-sm sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <Info size={16} className="mt-0.5 shrink-0 text-sky2-300" aria-hidden />
            <p className="text-cream/75">
              <strong className="font-semibold text-cream">Cargá vos los goles</strong> de cada
              partido: las posiciones se recalculan solas (reglas FIFA) y el bracket se va
              completando. Se guardan en este navegador para la próxima vez.
            </p>
          </div>
          {resultsCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-cream/70 transition-colors hover:border-red-400/40 hover:text-red-200 sm:self-auto"
            >
              <RotateCcw size={13} aria-hidden /> Reiniciar resultados ({resultsCount})
            </button>
          )}
        </div>
      )}

      {/* Aviso de error de actualización manteniendo la última data en pantalla */}
      {isError && data && (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200"
        >
          No pudimos actualizar los resultados. Mostramos la última versión disponible.
        </div>
      )}

      {/* Controles de la vista de grupos */}
      {section === 'groups' && (
        <div className="sticky top-[60px] z-30 -mx-4 mt-7 bg-night-950/60 px-4 py-3 backdrop-blur-md sm:top-[64px] sm:mx-0 sm:rounded-2xl sm:px-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterBar
              value={filter}
              onChange={(nextFilter) =>
                setFilter((current) => (current === nextFilter ? 'all' : nextFilter))
              }
              counts={{ upcoming: counts.upcoming }}
            />
            {!showUpcoming && (
              <SearchInput
                value={search}
                onChange={setSearch}
                className="w-full sm:max-w-xs"
                placeholder="Buscar país o grupo…"
              />
            )}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="mt-7">
        {isLoading && !data ? (
          <SkeletonGrid count={6} />
        ) : isError && !data ? (
          <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
        ) : (
          // key={section} remonta la vista al cambiar de sección y reproduce la
          // animación de entrada. Evitamos AnimatePresence mode="wait" para que
          // la vista nueva monte de inmediato (sin depender del exit anterior).
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {showUpcoming ? (
              <UpcomingMatchesView groups={view?.groups ?? []} knockout={view?.knockout ?? []} />
            ) : section === 'groups' ? (
              <GroupsView groups={view?.groups ?? []} filter={filter} search={search} />
            ) : (
              <KnockoutView ties={view?.knockout ?? []} />
            )}
          </motion.div>
        )}
      </div>
    </AppShell>
  )
}
