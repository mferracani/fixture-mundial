import type { Group, KnockoutTie, Match } from '@/types'
import { dayChipParts, dayKeyArgentina } from './date'
import { roundShortLabel } from './bracket'

export interface AgendaMatch {
  id: string
  match: Match
  /** Etiqueta de la instancia: "Grupo A", "Octavos", "Final"… */
  competition: string
  /** Placeholders para cruces sin equipos definidos. */
  sourceHome?: string
  sourceAway?: string
  /** ¿El equipo está confirmado o es una predicción (gris)? En grupos siempre
      es true; en eliminatoria depende de que el grupo/cruce previo esté resuelto. */
  homeConfirmed: boolean
  awayConfirmed: boolean
}

export interface AgendaDay {
  key: string // "2026-06-23"
  weekday: string // "Mar"
  day: string // "23"
  month: string // "Jun"
  matches: AgendaMatch[]
  finishedCount: number
}

const ROUND_LABELS: Record<string, string> = {
  round32: 'Dieciseisavos',
  round16: 'Octavos',
  quarter: 'Cuartos',
  semi: 'Semifinal',
  third: 'Tercer puesto',
  final: 'Final',
}

/** Sintetiza un Match a partir de un cruce eliminatorio aún sin partido. */
function tieToMatch(tie: KnockoutTie): Match | null {
  if (tie.match) return tie.match
  if (!tie.kickoffUtc) return null
  return {
    id: tie.id,
    stage: tie.round,
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

/**
 * Agrupa todos los partidos (grupos + eliminatoria) por día calendario en hora
 * de Argentina, ordenados por día y, dentro de cada día, por horario.
 */
export function buildAgenda(groups: Group[], knockout: KnockoutTie[]): AgendaDay[] {
  const items: AgendaMatch[] = []

  for (const g of groups) {
    for (const m of g.matches) {
      if (!m.kickoffUtc) continue
      // En grupos los equipos son reales: siempre confirmados.
      items.push({ id: m.id, match: m, competition: g.name, homeConfirmed: true, awayConfirmed: true })
    }
  }

  for (const tie of knockout) {
    const match = tieToMatch(tie)
    if (!match || !match.kickoffUtc) continue
    items.push({
      id: tie.id,
      match,
      competition: ROUND_LABELS[tie.round] ?? roundShortLabel(tie.id),
      sourceHome: tie.sourceHome,
      sourceAway: tie.sourceAway,
      // Predicho hasta que el grupo/cruce previo esté resuelto.
      homeConfirmed: !!tie.homeConfirmed,
      awayConfirmed: !!tie.awayConfirmed,
    })
  }

  const byDay = new Map<string, AgendaMatch[]>()
  for (const it of items) {
    const key = dayKeyArgentina(it.match.kickoffUtc!)
    const arr = byDay.get(key)
    if (arr) arr.push(it)
    else byDay.set(key, [it])
  }

  const days: AgendaDay[] = [...byDay.entries()]
    .map(([key, matches]) => {
      matches.sort(
        (a, b) => Date.parse(a.match.kickoffUtc!) - Date.parse(b.match.kickoffUtc!),
      )
      const parts = dayChipParts(key)
      return {
        key,
        weekday: parts.weekday,
        day: parts.day,
        month: parts.month,
        matches,
        finishedCount: matches.filter((m) => m.match.status === 'finished').length,
      }
    })
    .sort((a, b) => a.key.localeCompare(b.key))

  return days
}

/** Día a mostrar por defecto: hoy si tiene partidos; si no, el próximo con partidos. */
export function pickDefaultDay(days: AgendaDay[], todayKey: string): string | null {
  if (days.length === 0) return null
  const today = days.find((d) => d.key === todayKey)
  if (today) return today.key
  const upcoming = days.find((d) => d.key > todayKey)
  if (upcoming) return upcoming.key
  return days[days.length - 1].key
}
