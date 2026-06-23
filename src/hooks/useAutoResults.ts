import { useQuery } from '@tanstack/react-query'
import type { WorldCupData } from '@/types'
import { fetchAutoResults, type AutoResults } from '@/services/realResults/openFootball'
import { usePageVisibility } from './usePageVisibility'

// openfootball se actualiza ~1 vez por día (estilo wiki), así que no hace falta
// pollear seguido: 5 min con la pestaña visible, 20 min si está oculta.
const POLL_VISIBLE = 300_000
const POLL_HIDDEN = 1_200_000

export function useAutoResults(base: WorldCupData | undefined, enabled: boolean) {
  const visible = usePageVisibility()

  return useQuery<AutoResults, Error>({
    queryKey: ['auto-results', 'openfootball', base?.lastUpdatedUtc ?? null],
    queryFn: ({ signal }) => fetchAutoResults(base!, signal),
    enabled: enabled && !!base,
    staleTime: 60_000,
    retry: 2,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: true,
    refetchInterval: enabled ? (visible ? POLL_VISIBLE : POLL_HIDDEN) : false,
    refetchIntervalInBackground: false,
  })
}
