import { useQuery } from '@tanstack/react-query'
import { worldCupDataService } from '@/services/worldCupData'
import type { WorldCupData } from '@/types'
import { hasLiveMatches } from '@/utils/domain'
import { usePageVisibility } from './usePageVisibility'

const QUERY_KEY = ['worldcup-2026'] as const

// Frecuencias de polling inteligente.
const POLL_LIVE = 30_000 // 30s con partidos en vivo
const POLL_IDLE = 300_000 // 5min sin partidos en vivo
const POLL_HIDDEN = 600_000 // 10min con la pestaña oculta

export function useWorldCupData() {
  const visible = usePageVisibility()

  const query = useQuery<WorldCupData, Error>({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => worldCupDataService.fetchAll(signal),
    // Mantener la última data válida en pantalla ante un error de refetch.
    placeholderData: (prev) => prev,
    staleTime: 15_000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: (q) => {
      if (!visible) return POLL_HIDDEN
      return hasLiveMatches(q.state.data) ? POLL_LIVE : POLL_IDLE
    },
    refetchIntervalInBackground: false,
  })

  return {
    ...query,
    source: worldCupDataService.source,
    isLivePolling: visible && hasLiveMatches(query.data),
  }
}
