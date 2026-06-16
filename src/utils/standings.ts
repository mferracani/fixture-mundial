import type { Match, Standing, Team } from '@/types'

// Cálculo de la tabla de posiciones según las reglas oficiales de la FIFA
// para el Mundial 2026 (fase de grupos):
//
//   1. Mayor cantidad de puntos en todos los partidos del grupo.
//   2. Mayor diferencia de goles en todos los partidos del grupo.
//   3. Mayor cantidad de goles a favor en todos los partidos del grupo.
//
// Si dos o más equipos siguen igualados, se aplican entre ellos:
//   4. Puntos en los partidos entre los equipos empatados (enfrentamiento directo).
//   5. Diferencia de goles en esos partidos.
//   6. Goles a favor en esos partidos.
//   7. (Fair play y sorteo de la FIFA — no computables aquí; se usa el orden
//      del sorteo como desempate final estable.)

interface Row extends Standing {
  seed: number // orden del sorteo (bombo), desempate final estable
}

const PTS_WIN = 3
const PTS_DRAW = 1

function isFinished(m: Match): boolean {
  return (
    m.status === 'finished' &&
    m.homeScore != null &&
    m.awayScore != null &&
    !!m.homeTeam &&
    !!m.awayTeam
  )
}

/** Compara por criterios globales 1-3 (puntos, DG, GF). */
function compareOverall(a: Row, b: Row): number {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor
  )
}

function equalOverall(a: Row, b: Row): boolean {
  return (
    a.points === b.points &&
    a.goalDifference === b.goalDifference &&
    a.goalsFor === b.goalsFor
  )
}

/** Mini-tabla de enfrentamientos directos entre un subconjunto de equipos. */
function headToHead(
  cluster: Row[],
  matches: Match[],
): Record<string, { points: number; gd: number; gf: number }> {
  const ids = new Set(cluster.map((r) => r.teamId))
  const table: Record<string, { points: number; gd: number; gf: number }> = {}
  for (const r of cluster) table[r.teamId] = { points: 0, gd: 0, gf: 0 }

  for (const m of matches) {
    if (!isFinished(m)) continue
    const h = m.homeTeam!.id
    const a = m.awayTeam!.id
    if (!ids.has(h) || !ids.has(a)) continue // solo partidos entre los empatados
    const hs = m.homeScore!
    const as = m.awayScore!
    table[h].gf += hs
    table[a].gf += as
    table[h].gd += hs - as
    table[a].gd += as - hs
    if (hs > as) table[h].points += PTS_WIN
    else if (as > hs) table[a].points += PTS_WIN
    else {
      table[h].points += PTS_DRAW
      table[a].points += PTS_DRAW
    }
  }
  return table
}

export function computeStandings(teams: Team[], matches: Match[]): Standing[] {
  const rows: Record<string, Row> = {}
  teams.forEach((t, i) => {
    rows[t.id] = {
      teamId: t.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      rank: 0,
      qualificationStatus: 'none',
      seed: i,
    }
  })

  for (const m of matches) {
    if (!isFinished(m)) continue
    const h = rows[m.homeTeam!.id]
    const a = rows[m.awayTeam!.id]
    if (!h || !a) continue
    const hs = m.homeScore!
    const as = m.awayScore!
    h.played++
    a.played++
    h.goalsFor += hs
    h.goalsAgainst += as
    a.goalsFor += as
    a.goalsAgainst += hs
    if (hs > as) {
      h.won++
      h.points += PTS_WIN
      a.lost++
    } else if (as > hs) {
      a.won++
      a.points += PTS_WIN
      h.lost++
    } else {
      h.drawn++
      a.drawn++
      h.points += PTS_DRAW
      a.points += PTS_DRAW
    }
  }

  const all = Object.values(rows)
  for (const r of all) r.goalDifference = r.goalsFor - r.goalsAgainst

  // Orden global (criterios 1-3)
  all.sort(compareOverall)

  // Desempate por enfrentamiento directo (criterios 4-6) dentro de cada
  // bloque de equipos igualados en los criterios globales.
  let i = 0
  while (i < all.length) {
    let j = i + 1
    while (j < all.length && equalOverall(all[i], all[j])) j++
    if (j - i > 1) {
      const cluster = all.slice(i, j)
      const h2h = headToHead(cluster, matches)
      cluster.sort(
        (x, y) =>
          h2h[y.teamId].points - h2h[x.teamId].points ||
          h2h[y.teamId].gd - h2h[x.teamId].gd ||
          h2h[y.teamId].gf - h2h[x.teamId].gf ||
          y.goalsFor - x.goalsFor ||
          x.seed - y.seed,
      )
      for (let k = 0; k < cluster.length; k++) all[i + k] = cluster[k]
    }
    i = j
  }

  all.forEach((r, idx) => (r.rank = idx + 1))

  // Quitar el campo auxiliar `seed`
  return all.map(({ seed: _seed, ...s }) => s)
}

/** Total de partidos finalizados en una lista. */
export function playedCount(matches: Match[]): number {
  return matches.filter(isFinished).length
}

/** ¿Están todos los partidos del grupo finalizados? */
export function allFinished(matches: Match[]): boolean {
  return matches.length > 0 && matches.every(isFinished)
}
