import type { Group, GroupStatus, Match, MatchStatus, WorldCupData } from '@/types'

export const LIVE_STATUSES: MatchStatus[] = ['live', 'halftime']

export const isLive = (m: Match): boolean => LIVE_STATUSES.includes(m.status)
export const isFinished = (m: Match): boolean => m.status === 'finished'
export const isUpcoming = (m: Match): boolean =>
  m.status === 'scheduled' || m.status === 'postponed' || m.status === 'suspended'

/** ¿Hay algún partido en vivo en todo el torneo? */
export function hasLiveMatches(data: WorldCupData | undefined): boolean {
  if (!data) return false
  const groupLive = data.groups.some((g) => g.matches.some(isLive))
  const koLive = data.knockout.some((t) => t.match && isLive(t.match))
  return groupLive || koLive
}

/** Estado agregado de un grupo. */
export function groupStatus(group: Group): GroupStatus {
  const matches = group.matches
  if (matches.some(isLive)) return 'playing'
  const allFinished = matches.length > 0 && matches.every((m) => m.status === 'finished')
  if (allFinished) return 'decided'
  const someFinished = matches.some((m) => m.status === 'finished')
  return someFinished ? 'playing' : 'pending'
}

export function groupHasLive(group: Group): boolean {
  return group.matches.some(isLive)
}

export const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: 'Próximo',
  live: 'En vivo',
  halftime: 'Entretiempo',
  finished: 'Finalizado',
  postponed: 'Postergado',
  suspended: 'Suspendido',
}

export const GROUP_STATUS_LABELS: Record<GroupStatus, string> = {
  pending: 'Pendiente',
  playing: 'En juego',
  decided: 'Definido',
}

export type MatchFilter = 'all' | 'live' | 'upcoming' | 'finished'

export function matchesFilter(m: Match, filter: MatchFilter): boolean {
  switch (filter) {
    case 'live':
      return isLive(m)
    case 'upcoming':
      return isUpcoming(m)
    case 'finished':
      return isFinished(m)
    default:
      return true
  }
}

/** Normaliza texto para búsqueda (sin acentos, minúsculas). */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

/** ¿El grupo matchea la búsqueda por país o nombre de grupo? */
export function groupMatchesSearch(group: Group, query: string): boolean {
  if (!query) return true
  const q = normalize(query)
  if (normalize(group.name).includes(q)) return true
  if (normalize(group.id).includes(q)) return true
  return group.teams.some(
    (t) => normalize(t.name).includes(q) || normalize(t.shortName).includes(q),
  )
}

export function teamMatchesSearch(name: string | undefined, query: string): boolean {
  if (!query) return true
  if (!name) return false
  return normalize(name).includes(normalize(query))
}

/** Cuenta partidos por estado en todo el torneo. */
export function countByState(
  data: Pick<WorldCupData, 'groups' | 'knockout'> | undefined,
) {
  const all: Match[] = []
  if (data) {
    for (const g of data.groups) all.push(...g.matches)
    for (const t of data.knockout) {
      if (t.match) {
        all.push(t.match)
      } else if (t.kickoffUtc) {
        all.push({
          id: t.id,
          stage: t.round,
          homeTeam: t.homeTeam ?? null,
          awayTeam: t.awayTeam ?? null,
          homeScore: null,
          awayScore: null,
          penaltiesHome: null,
          penaltiesAway: null,
          status: 'scheduled',
          minute: null,
          kickoffUtc: t.kickoffUtc,
          stadium: t.stadium,
          city: t.city,
          winnerTeamId: null,
        })
      }
    }
  }
  return {
    total: all.length,
    live: all.filter(isLive).length,
    upcoming: all.filter(isUpcoming).length,
    finished: all.filter(isFinished).length,
  }
}
