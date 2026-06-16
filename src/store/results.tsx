import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ResultsMap, ScoreEntry } from '@/utils/fixture'

const STORAGE_KEY = 'mundial2026:results:v1'

interface ResultsContextValue {
  results: ResultsMap
  /** Carga/actualiza el marcador de un partido. null en ambos => limpia. */
  setScore: (matchId: string, home: number | null, away: number | null) => void
  /** Define los penales de un cruce eliminatorio (empate en tiempo regular). */
  setPenalties: (matchId: string, home: number | null, away: number | null) => void
  /** Borra el resultado de un partido. */
  clearScore: (matchId: string) => void
  /** Borra todos los resultados cargados. */
  clearAll: () => void
}

const ResultsContext = createContext<ResultsContextValue | null>(null)

function loadInitial(): ResultsMap {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ResultsMap) : {}
  } catch {
    return {}
  }
}

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<ResultsMap>(loadInitial)

  // Persistir en cada cambio.
  useEffect(() => {
    try {
      if (Object.keys(results).length === 0) localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }, [results])

  const setScore = useCallback((matchId: string, home: number | null, away: number | null) => {
    setResults((prev) => {
      const next = { ...prev }
      const cur = next[matchId]
      if (home == null && away == null) {
        // Sin goles: si tampoco hay penales, se elimina la entrada.
        if (cur?.penaltiesHome == null && cur?.penaltiesAway == null) {
          delete next[matchId]
          return next
        }
      }
      const entry: ScoreEntry = {
        home,
        away,
        penaltiesHome: cur?.penaltiesHome ?? null,
        penaltiesAway: cur?.penaltiesAway ?? null,
      }
      // Si deja de haber empate, los penales pierden sentido.
      if (home != null && away != null && home !== away) {
        entry.penaltiesHome = null
        entry.penaltiesAway = null
      }
      next[matchId] = entry
      return next
    })
  }, [])

  const setPenalties = useCallback((matchId: string, home: number | null, away: number | null) => {
    setResults((prev) => {
      const cur = prev[matchId]
      if (!cur) return prev
      return { ...prev, [matchId]: { ...cur, penaltiesHome: home, penaltiesAway: away } }
    })
  }, [])

  const clearScore = useCallback((matchId: string) => {
    setResults((prev) => {
      if (!(matchId in prev)) return prev
      const next = { ...prev }
      delete next[matchId]
      return next
    })
  }, [])

  const clearAll = useCallback(() => setResults({}), [])

  const value = useMemo(
    () => ({ results, setScore, setPenalties, clearScore, clearAll }),
    [results, setScore, setPenalties, clearScore, clearAll],
  )

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
}

export function useResults(): ResultsContextValue {
  const ctx = useContext(ResultsContext)
  if (!ctx) throw new Error('useResults debe usarse dentro de <ResultsProvider>')
  return ctx
}
