// Genera src/data/worldcup-2026.mock.json
//
// PRINCIPIO: 100% real, sin inventar nada.
//   - Equipos y grupos: REALES (sorteo oficial 5 dic 2025, verificado FIFA/ESPN).
//   - Enfrentamientos de grupo: REALES (round-robin: cada equipo vs los otros 3).
//   - Resultados / marcadores / estado "en vivo": NINGUNO (no se inventan).
//   - Fechas, horarios y sedes exactos: "a confirmar" (no se fabrican datos no
//     verificables). Deben venir de una API real vía VITE_SPORTS_API_BASE_URL.
//
// Ejecutar: npm run gen:data
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'worldcup-2026.mock.json')

// ---- Emoji de bandera desde código ISO alpha-2 ----
const flagEmoji = (code) =>
  code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))

// Subdivisiones sin ISO-2 (Escocia, Inglaterra)
const SCO = { emoji: '🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}', cdn: 'gb-sct' }
const ENG = { emoji: '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}', cdn: 'gb-eng' }

// ---- 48 selecciones REALES del Mundial 2026 (sorteo oficial 5 dic 2025) ----
// [nombre, shortName (código FIFA), ISO-2, flagOverride?]
const GROUPS_DEF = {
  A: [['México', 'MEX', 'MX'], ['Sudáfrica', 'RSA', 'ZA'], ['Corea del Sur', 'KOR', 'KR'], ['Chequia', 'CZE', 'CZ']],
  B: [['Canadá', 'CAN', 'CA'], ['Bosnia y Herzegovina', 'BIH', 'BA'], ['Catar', 'QAT', 'QA'], ['Suiza', 'SUI', 'CH']],
  C: [['Brasil', 'BRA', 'BR'], ['Marruecos', 'MAR', 'MA'], ['Haití', 'HAI', 'HT'], ['Escocia', 'SCO', 'GB', SCO]],
  D: [['Estados Unidos', 'USA', 'US'], ['Paraguay', 'PAR', 'PY'], ['Australia', 'AUS', 'AU'], ['Turquía', 'TUR', 'TR']],
  E: [['Alemania', 'GER', 'DE'], ['Curazao', 'CUW', 'CW'], ['Costa de Marfil', 'CIV', 'CI'], ['Ecuador', 'ECU', 'EC']],
  F: [['Países Bajos', 'NED', 'NL'], ['Japón', 'JPN', 'JP'], ['Suecia', 'SWE', 'SE'], ['Túnez', 'TUN', 'TN']],
  G: [['Bélgica', 'BEL', 'BE'], ['Egipto', 'EGY', 'EG'], ['Irán', 'IRN', 'IR'], ['Nueva Zelanda', 'NZL', 'NZ']],
  H: [['España', 'ESP', 'ES'], ['Cabo Verde', 'CPV', 'CV'], ['Arabia Saudita', 'KSA', 'SA'], ['Uruguay', 'URU', 'UY']],
  I: [['Francia', 'FRA', 'FR'], ['Senegal', 'SEN', 'SN'], ['Irak', 'IRQ', 'IQ'], ['Noruega', 'NOR', 'NO']],
  J: [['Argentina', 'ARG', 'AR'], ['Argelia', 'ALG', 'DZ'], ['Austria', 'AUT', 'AT'], ['Jordania', 'JOR', 'JO']],
  K: [['Portugal', 'POR', 'PT'], ['RD Congo', 'COD', 'CD'], ['Uzbekistán', 'UZB', 'UZ'], ['Colombia', 'COL', 'CO']],
  L: [['Inglaterra', 'ENG', 'GB', ENG], ['Croacia', 'CRO', 'HR'], ['Ghana', 'GHA', 'GH'], ['Panamá', 'PAN', 'PA']],
}

// ---- Construcción de equipos ----
const teams = {}
const groupOrder = Object.keys(GROUPS_DEF)
for (const g of groupOrder) {
  GROUPS_DEF[g].forEach(([name, shortName, iso, override], i) => {
    const id = `t-${g}-${i}`
    teams[id] = {
      id,
      name,
      shortName,
      countryCode: iso,
      flagEmoji: override ? override.emoji : flagEmoji(iso),
      flagUrl: `https://flagcdn.com/${(override ? override.cdn : iso).toLowerCase()}.svg`,
      groupId: g,
    }
  })
}
const teamRef = (id) => teams[id]

// ---- Partidos de grupo: round-robin real, SIN resultados ni horarios inventados ----
let matchSeq = 0
const mkId = (p) => `${p}-${String(++matchSeq).padStart(3, '0')}`

// Las 6 combinaciones reales de un grupo de 4 equipos.
const RR_PAIRS = [
  [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
]

const groups = []
for (const g of groupOrder) {
  const ids = GROUPS_DEF[g].map((_, i) => `t-${g}-${i}`)

  const matches = RR_PAIRS.map(([h, a]) => ({
    id: mkId('m-grp'),
    stage: 'group',
    groupId: g,
    round: 'Fase de grupos',
    homeTeam: teamRef(ids[h]),
    awayTeam: teamRef(ids[a]),
    homeScore: null,
    awayScore: null,
    penaltiesHome: null,
    penaltiesAway: null,
    status: 'scheduled',
    minute: null,
    kickoffUtc: null, // Horario real lo provee la API
    stadium: undefined,
    city: undefined,
    winnerTeamId: null,
  }))

  // Tabla de posiciones inicial: sin partidos jugados (todo en cero).
  // El orden inicial respeta el orden de bombos del sorteo.
  const standings = ids.map((id, i) => ({
    teamId: id,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    rank: i + 1,
    qualificationStatus: 'none', // Nada clasificado todavía
  }))

  groups.push({
    id: g,
    name: `Grupo ${g}`,
    teams: ids.map(teamRef),
    standings,
    matches,
  })
}

// ---- Bracket eliminatorio: estructura real, cruces por definir ----
// No se inventan equipos ni resultados. Las etiquetas describen el TIPO de
// clasificado (ganador / segundo / mejor tercero), sin asignar grupos puntuales,
// porque el cruce exacto se define al cerrar la fase de grupos.
const knockout = []
let koSeq = 0
const koId = (p) => `${p}-${++koSeq}`

const emptyTie = (id, round, side, position, sourceHome, sourceAway) => ({
  id,
  round,
  side,
  position,
  match: null, // Sin partido todavía
  sourceHome,
  sourceAway,
  nextTieId: null,
})

// Dieciseisavos: 16 cruces (8 por lado). Slots reales: 12 ganadores, 12
// segundos y 8 mejores terceros se reparten en estos 16 partidos.
const R32_SLOTS = [
  ['Ganador de grupo', 'Mejor tercero'],
  ['Segundo de grupo', 'Segundo de grupo'],
  ['Ganador de grupo', 'Mejor tercero'],
  ['Ganador de grupo', 'Segundo de grupo'],
]
const r32 = []
for (let i = 0; i < 16; i++) {
  const side = i < 8 ? 'left' : 'right'
  const slot = R32_SLOTS[i % R32_SLOTS.length]
  const tie = emptyTie(koId('r32'), 'round32', side, i % 8, slot[0], slot[1])
  r32.push(tie)
  knockout.push(tie)
}

// Octavos: 8 cruces
const r16 = []
for (let i = 0; i < 8; i++) {
  const side = i < 4 ? 'left' : 'right'
  const tie = emptyTie(koId('r16'), 'round16', side, i % 4, 'Ganador de dieciseisavos', 'Ganador de dieciseisavos')
  r16.push(tie)
  r32[i * 2].nextTieId = tie.id
  r32[i * 2 + 1].nextTieId = tie.id
  knockout.push(tie)
}

// Cuartos: 4 cruces
const qf = []
for (let i = 0; i < 4; i++) {
  const side = i < 2 ? 'left' : 'right'
  const tie = emptyTie(koId('qf'), 'quarter', side, i % 2, 'Ganador de octavos', 'Ganador de octavos')
  qf.push(tie)
  r16[i * 2].nextTieId = tie.id
  r16[i * 2 + 1].nextTieId = tie.id
  knockout.push(tie)
}

// Semifinales: 2 cruces
const sf = []
for (let i = 0; i < 2; i++) {
  const side = i === 0 ? 'left' : 'right'
  const tie = emptyTie(koId('sf'), 'semi', side, 0, 'Ganador de cuartos', 'Ganador de cuartos')
  sf.push(tie)
  qf[i * 2].nextTieId = tie.id
  qf[i * 2 + 1].nextTieId = tie.id
  knockout.push(tie)
}

// Tercer puesto
const third = emptyTie(koId('third'), 'third', 'center', 0, 'Perdedor de semifinal', 'Perdedor de semifinal')
knockout.push(third)

// Final
const final = emptyTie(koId('final'), 'final', 'center', 0, 'Ganador de semifinal', 'Ganador de semifinal')
sf[0].nextTieId = final.id
sf[1].nextTieId = final.id
knockout.push(final)

const data = {
  groups,
  knockout,
  lastUpdatedUtc: new Date().toISOString(),
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(data, null, 2))
console.log(
  `✓ Mock generado (datos reales, sin resultados inventados): ${OUT}\n` +
    `  ${groups.length} grupos · ${groups.reduce((n, g) => n + g.matches.length, 0)} partidos de grupo (programados) · ` +
    `${knockout.length} cruces eliminatorios (por definir)`,
)
