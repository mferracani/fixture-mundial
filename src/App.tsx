import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/AppShell'
import { HeroHeader } from '@/components/HeroHeader'
import { AutoCompleteBar } from '@/components/AutoCompleteBar'
import { FilterBar } from '@/components/FilterBar'
import { SearchInput } from '@/components/SearchInput'
import { SkeletonGrid } from '@/components/SkeletonCard'
import { ErrorState } from '@/components/ErrorState'
import type { Section } from '@/components/TopNavigation'
import { AgendaView } from '@/features/agenda/AgendaView'
import { GroupsView } from '@/features/groups/GroupsView'
import { UpcomingMatchesView } from '@/features/groups/UpcomingMatchesView'
import { KnockoutView } from '@/features/knockout/KnockoutView'
import { useWorldCupData } from '@/hooks/useWorldCupData'
import { useAutoResults } from '@/hooks/useAutoResults'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useResults } from '@/store/results'
import { useSettings, RealDataProvider } from '@/store/settings'
import { buildFixtureView } from '@/utils/fixture'
import { countByState, type MatchFilter } from '@/utils/domain'

export default function App() {
  const [section, setSection] = useState<Section>('agenda')
  const [filter, setFilter] = useState<MatchFilter>('all')
  const [search, setSearch] = useState('')

  const online = useOnlineStatus()
  const { data, isLoading, isError, isFetching, refetch, source } = useWorldCupData()
  const { results, clearAll } = useResults()
  const { autoComplete, setAutoComplete } = useSettings()

  // Resultados reales (openfootball) cargados automáticamente cuando el modo
  // autocompletar está activo. Se descargan de la red, no se persisten.
  const auto = useAutoResults(data, autoComplete)
  const realResults = auto.data?.results
  const realIds = useMemo(
    () => new Set(autoComplete && realResults ? Object.keys(realResults) : []),
    [autoComplete, realResults],
  )

  // "Lo real pisa lo mío": los resultados reales reemplazan mis predicciones de
  // partidos ya jugados; los partidos futuros conservan lo que cargué a mano.
  const effectiveResults = useMemo(
    () => (autoComplete && realResults ? { ...results, ...realResults } : results),
    [autoComplete, realResults, results],
  )

  // Vista derivada: aplica los resultados, recalcula posiciones (reglas FIFA) y
  // resuelve el bracket (equipos probables / confirmados).
  const view = useMemo(
    () => (data ? buildFixtureView(data, effectiveResults) : undefined),
    [data, effectiveResults],
  )

  const counts = useMemo(() => countByState(view), [view])
  const resultsCount = Object.keys(results).length
  const realDataValue = useMemo(() => ({ autoComplete, realIds }), [autoComplete, realIds])
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

      {/* Control de autocompletado: resultados reales (openfootball) on/off */}
      {source === 'mock' && (
        <AutoCompleteBar
          autoComplete={autoComplete}
          onToggle={setAutoComplete}
          isFetching={auto.isFetching}
          isError={auto.isError}
          appliedCount={auto.data?.appliedCount ?? 0}
          fetchedAt={auto.data?.fetchedAt ?? null}
          manualCount={resultsCount}
          onClearManual={clearAll}
        />
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
          <RealDataProvider value={realDataValue}>
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {section === 'agenda' ? (
                <AgendaView groups={view?.groups ?? []} knockout={view?.knockout ?? []} />
              ) : showUpcoming ? (
                <UpcomingMatchesView groups={view?.groups ?? []} knockout={view?.knockout ?? []} />
              ) : section === 'groups' ? (
                <GroupsView groups={view?.groups ?? []} filter={filter} search={search} />
              ) : (
                <KnockoutView ties={view?.knockout ?? []} />
              )}
            </motion.div>
          </RealDataProvider>
        )}
      </div>
    </AppShell>
  )
}
