import type { Group, KnockoutTie, Match, Stage, Standing, Team, WorldCupData } from '@/types'
import { computeStandings, allFinished, playedCount } from './standings'
import { BRACKET, roundShortLabel, type SlotRef, type TieDef } from './bracket'

// Resultado cargado manualmente por el usuario para un partido.
export interface ScoreEntry {
  home: number | null
  away: number | null
  penaltiesHome?: number | null
  penaltiesAway?: number | null
}

export type ResultsMap = Record<string, ScoreEntry>

export interface FixtureView {
  groups: Group[]
  knockout: KnockoutTie[]
  allDecided: boolean
  hasResults: boolean
}

// ---- Aplicar un resultado cargado a un partido ----
function applyResult(match: Match, entry: ScoreEntry | undefined): Match {
  const home = entry?.home ?? null
  const away = entry?.away ?? null
  const ph = entry?.penaltiesHome ?? null
  const pa = entry?.penaltiesAway ?? null
  const hasScore = home != null && away != null
  if (!hasScore) {
    return { ...match, homeScore: null, awayScore: null, penaltiesHome: null, penaltiesAway: null, status: 'scheduled', winnerTeamId: null }
  }
  let winnerTeamId: string | null = null
  if (home > away) winnerTeamId = match.homeTeam?.id ?? null
  else if (away > home) winnerTeamId = match.awayTeam?.id ?? null
  else if (ph != null && pa != null && ph !== pa) {
    winnerTeamId = ph > pa ? (match.homeTeam?.id ?? null) : (match.awayTeam?.id ?? null)
  }
  return {
    ...match,
    homeScore: home,
    awayScore: away,
    penaltiesHome: ph,
    penaltiesAway: pa,
    status: 'finished',
    winnerTeamId,
  }
}

// ---- Resolución de un slot del bracket ----
interface SlotResolution {
  team: Team | null
  confirmed: boolean
  label: string
}

interface ResolvedTie {
  winnerTeam: Team | null
  loserTeam: Team | null
  winnerConfirmed: boolean
  loserConfirmed: boolean
}

interface BuildCtx {
  teamsById: Record<string, Team>
  standingsByGroup: Record<string, Standing[]>
  decided: Record<string, boolean>
  qualifiedThirds: Standing[]
  allDecided: boolean
  resolved: Record<string, ResolvedTie>
}

function resolveSlot(ref: SlotRef, ctx: BuildCtx): SlotResolution {
  switch (ref.kind) {
    case 'winner': {
      const s = ctx.standingsByGroup[ref.group]?.[0]
      const team = s ? ctx.teamsById[s.teamId] : null
      return { team, confirmed: !!team && ctx.decided[ref.group], label: `Ganador Grupo ${ref.group}` }
    }
    case 'runner': {
      const s = ctx.standingsByGroup[ref.group]?.[1]
      const team = s ? ctx.teamsById[s.teamId] : null
      return { team, confirmed: !!team && ctx.decided[ref.group], label: `2º Grupo ${ref.group}` }
    }
    case 'third': {
      const s = ctx.qualifiedThirds[ref.rank]
      const team = s ? ctx.teamsById[s.teamId] : null
      return { team, confirmed: !!team && ctx.allDecided, label: 'Mejor tercero' }
    }
    case 'winnerOf': {
      const r = ctx.resolved[ref.tieId]
      return {
        team: r?.winnerTeam ?? null,
        confirmed: !!r?.winnerConfirmed,
        label: `Ganador ${roundShortLabel(ref.tieId)}`,
      }
    }
    case 'loserOf': {
      const r = ctx.resolved[ref.tieId]
      return {
        team: r?.loserTeam ?? null,
        confirmed: !!r?.loserConfirmed,
        label: `Perdedor ${roundShortLabel(ref.tieId)}`,
      }
    }
  }
}

function buildKnockoutMatch(
  def: TieDef,
  home: Team,
  away: Team,
  entry: ScoreEntry | undefined,
): Match {
  const base: Match = {
    id: def.id,
    stage: def.round,
    round: undefined,
    homeTeam: home,
    awayTeam: away,
    homeScore: null,
    awayScore: null,
    penaltiesHome: null,
    penaltiesAway: null,
    status: 'scheduled',
    minute: null,
    kickoffUtc: null,
    winnerTeamId: null,
  }
  return applyResult(base, entry)
}

export function buildFixtureView(base: WorldCupData, results: ResultsMap): FixtureView {
  const teamsById: Record<string, Team> = {}
  for (const g of base.groups) for (const t of g.teams) teamsById[t.id] = t

  // 1. Grupos con resultados aplicados + tabla recalculada
  const groups: Group[] = base.groups.map((g) => {
    const matches = g.matches.map((m) => applyResult(m, results[m.id]))
    const standings = computeStandings(g.teams, matches)
    return { ...g, matches, standings }
  })

  const standingsByGroup: Record<string, Standing[]> = {}
  const decided: Record<string, boolean> = {}
  for (const g of groups) {
    standingsByGroup[g.id] = g.standings
    decided[g.id] = allFinished(g.matches)
  }
  const allDecided = groups.every((g) => decided[g.id])

  // 2. Ranking de mejores terceros (criterios FIFA: pts, DG, GF)
  const thirds = groups.map((g) => g.standings[2]).filter(Boolean) as Standing[]
  const rankedThirds = [...thirds].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor,
  )
  const qualifiedThirds = rankedThirds.slice(0, 8)
  const qualifiedThirdIds = new Set(qualifiedThirds.map((s) => s.teamId))

  // 3. Marcar estado de clasificación en cada tabla (solo si ya se jugó algo)
  for (const g of groups) {
    const played = playedCount(g.matches)
    for (const s of g.standings) {
      if (played === 0) {
        s.qualificationStatus = 'none'
      } else if (s.rank <= 2) {
        s.qualificationStatus = 'direct'
      } else if (s.rank === 3) {
        s.qualificationStatus = qualifiedThirdIds.has(s.teamId) ? 'best-third' : 'eliminated'
      } else {
        s.qualificationStatus = 'eliminated'
      }
    }
  }

  // 4. Resolver el bracket en orden (las fases posteriores dependen de las previas)
  const ctx: BuildCtx = {
    teamsById,
    standingsByGroup,
    decided,
    qualifiedThirds,
    allDecided,
    resolved: {},
  }

  const knockout: KnockoutTie[] = BRACKET.map((def) => {
    const h = resolveSlot(def.home, ctx)
    const a = resolveSlot(def.away, ctx)
    const entry = results[def.id]
    const match = h.team && a.team ? buildKnockoutMatch(def, h.team, a.team, entry) : null

    let winnerTeam: Team | null = null
    let loserTeam: Team | null = null
    let winnerConfirmed = false
    let loserConfirmed = false
    if (match && match.status === 'finished' && match.winnerTeamId) {
      const homeWon = match.winnerTeamId === h.team!.id
      winnerTeam = homeWon ? h.team : a.team
      loserTeam = homeWon ? a.team : h.team
      winnerConfirmed = h.confirmed && a.confirmed
      loserConfirmed = winnerConfirmed
    }
    ctx.resolved[def.id] = { winnerTeam, loserTeam, winnerConfirmed, loserConfirmed }

    const tie: KnockoutTie = {
      id: def.id,
      round: def.round as Stage,
      side: def.side,
      position: def.position,
      match,
      sourceHome: h.label,
      sourceAway: a.label,
      homeTeam: h.team,
      awayTeam: a.team,
      homeConfirmed: !!h.team && h.confirmed,
      awayConfirmed: !!a.team && a.confirmed,
      nextTieId: null,
    }
    return tie
  })

  return {
    groups,
    knockout,
    allDecided,
    hasResults: Object.keys(results).length > 0,
  }
}
