import type { WorldCupData } from '@/types'
import type { ResultsMap } from '@/utils/fixture'
import { ofNameToCode } from './nameMap'

// Fuente: openfootball/worldcup.json (dominio público, sin API key).
// raw.githubusercontent va primero: CORS abierto y cache de 5 min (fresco).
// jsDelivr queda como respaldo si GitHub no responde.
const SOURCES = [
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json',
  'https://cdn.jsdelivr.net/gh/openfootball/worldcup.json@master/2026/worldcup.json',
]

interface OfScore {
  ft?: [number, number] | null
  ht?: [number, number] | null
}

interface OfMatch {
  round?: string
  date?: string
  team1?: string
  team2?: string
  score?: OfScore | null
  group?: string | null
}

interface OfData {
  name?: string
  matches?: OfMatch[]
}

export interface AutoResults {
  /** Resultados reales mapeados a los IDs de partido del mock (fase de grupos). */
  results: ResultsMap
  /** Cuántos partidos se pudieron mapear con marcador. */
  appliedCount: number
  /** Cuántos partidos de grupo traían marcador en la fuente. */
  totalWithScore: number
  /** Momento de la descarga (ISO). */
  fetchedAt: string
  source: 'openfootball'
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|')
}

async function fetchOfData(signal?: AbortSignal): Promise<OfData> {
  let lastErr: unknown
  for (const url of SOURCES) {
    try {
      const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
      if (res.ok) return (await res.json()) as OfData
      lastErr = new Error(`${url} respondió ${res.status}`)
    } catch (err) {
      if (signal?.aborted) throw err
      lastErr = err
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('No se pudo obtener openfootball')
}

/**
 * Descarga los resultados reales de openfootball y los mapea a los IDs de
 * partido del mock. Solo fase de grupos: el join se hace por (grupo + par de
 * códigos ISO), 100% determinístico. La eliminatoria se propaga sola desde las
 * posiciones reales mediante el motor de bracket.
 */
export async function fetchAutoResults(
  base: WorldCupData,
  signal?: AbortSignal,
): Promise<AutoResults> {
  const data = await fetchOfData(signal)

  // Índice: grupo -> (par de códigos -> partido del mock)
  const index: Record<string, Map<string, { id: string; homeCode: string; awayCode: string }>> = {}
  for (const g of base.groups) {
    const map = new Map<string, { id: string; homeCode: string; awayCode: string }>()
    for (const m of g.matches) {
      const hc = m.homeTeam?.countryCode
      const ac = m.awayTeam?.countryCode
      if (!hc || !ac) continue
      map.set(pairKey(hc, ac), { id: m.id, homeCode: hc, awayCode: ac })
    }
    index[g.id] = map
  }

  const results: ResultsMap = {}
  let appliedCount = 0
  let totalWithScore = 0

  for (const om of data.matches ?? []) {
    if (!om.group || !om.team1 || !om.team2) continue // solo fase de grupos
    const ft = om.score?.ft
    if (!ft || typeof ft[0] !== 'number' || typeof ft[1] !== 'number') continue
    totalWithScore++

    const code1 = ofNameToCode(om.team1)
    const code2 = ofNameToCode(om.team2)
    if (!code1 || !code2) continue

    const groupId = om.group.replace(/^group\s+/i, '').trim()
    const hit = index[groupId]?.get(pairKey(code1, code2))
    if (!hit) continue

    // Orientar el marcador según el orden local/visitante del mock.
    let home: number
    let away: number
    if (hit.homeCode === code1 && hit.awayCode === code2) {
      home = ft[0]
      away = ft[1]
    } else {
      home = ft[1]
      away = ft[0]
    }

    results[hit.id] = { home, away, penaltiesHome: null, penaltiesAway: null }
    appliedCount++
  }

  return {
    results,
    appliedCount,
    totalWithScore,
    fetchedAt: new Date().toISOString(),
    source: 'openfootball',
  }
}
