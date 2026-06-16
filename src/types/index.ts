// Modelo de datos del frontend para el Mundial 2026.
// Estas estructuras son agnósticas del proveedor: cualquier adaptador
// (mock o API real) debe normalizar sus datos a estas formas.

export type MatchStatus =
  | 'scheduled' // Programado
  | 'live' // En vivo
  | 'halftime' // Entretiempo
  | 'finished' // Finalizado
  | 'postponed' // Postergado
  | 'suspended' // Suspendido

export type Stage =
  | 'group' // Fase de grupos
  | 'round32' // Dieciseisavos
  | 'round16' // Octavos
  | 'quarter' // Cuartos
  | 'semi' // Semifinales
  | 'third' // Tercer puesto
  | 'final' // Final

export type QualificationStatus =
  | 'direct' // Clasifica directo a eliminatorias (1º o 2º)
  | 'best-third' // Puede clasificar como mejor tercero
  | 'eliminated' // Eliminado
  | 'none' // Sin definir

export type GroupStatus = 'pending' | 'playing' | 'decided'

export type BracketSide = 'left' | 'right' | 'center'

export interface Team {
  id: string
  name: string
  shortName: string
  countryCode: string // ISO 3166-1 alpha-2 (ej: "AR")
  flagUrl?: string
  flagEmoji: string
  groupId?: string
}

export interface Standing {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  rank: number
  qualificationStatus: QualificationStatus
}

export interface Match {
  id: string
  stage: Stage
  groupId?: string
  round?: string // Etiqueta de jornada/fase legible
  homeTeam: Team | null
  awayTeam: Team | null
  homeScore: number | null
  awayScore: number | null
  penaltiesHome: number | null
  penaltiesAway: number | null
  status: MatchStatus
  minute: number | null // Minuto de juego si está en vivo
  kickoffUtc: string | null // ISO 8601 en UTC (null si el horario está por confirmar)
  stadium?: string
  city?: string
  winnerTeamId?: string | null
}

export interface Group {
  id: string
  name: string // "Grupo A"
  teams: Team[]
  standings: Standing[]
  matches: Match[]
}

export interface KnockoutTie {
  id: string
  round: Stage
  side: BracketSide
  position: number // Orden dentro de la columna (de arriba hacia abajo)
  match: Match | null
  sourceHome: string // Placeholder legible: "Ganador Grupo A"
  sourceAway: string
  nextTieId?: string | null
  // Equipos resueltos en cada slot (predichos o confirmados), independientes de
  // que el partido ya tenga ambos rivales. Permiten mostrar un equipo que
  // avanzó aunque su rival todavía no esté definido.
  homeTeam?: Team | null
  awayTeam?: Team | null
  // ¿El equipo local/visitante ya está confirmado (grupo terminado / cruce
  // resuelto) o es una predicción según la posición actual?
  homeConfirmed?: boolean
  awayConfirmed?: boolean
}

export interface WorldCupData {
  groups: Group[]
  knockout: KnockoutTie[]
  lastUpdatedUtc: string
}
