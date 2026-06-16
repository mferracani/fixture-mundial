import type { BracketSide, Stage } from '@/types'

// Estructura del cuadro eliminatorio (32 clasificados).
//
// Slots de cada cruce de dieciseisavos:
//   - 12 ganadores de grupo + 12 segundos + 8 mejores terceros = 32.
//
// El cuadro está armado de forma simétrica (8 cruces por lado) y SIN que
// dos equipos del mismo grupo se crucen en dieciseisavos: los ganadores se
// enfrentan a segundos de OTRO grupo, y los terceros entre sí. La asignación
// exacta tercero→llave en la FIFA surge de una tabla oficial según qué grupos
// aportan terceros; acá se usa el ranking de terceros (1º a 8º) de forma
// determinística, suficiente para un predictor personal.

export type SlotRef =
  | { kind: 'winner'; group: string }
  | { kind: 'runner'; group: string }
  | { kind: 'third'; rank: number } // 0-based en el ranking de terceros
  | { kind: 'winnerOf'; tieId: string }
  | { kind: 'loserOf'; tieId: string }

export interface TieDef {
  id: string
  round: Stage
  side: BracketSide
  position: number
  home: SlotRef
  away: SlotRef
}

const W = (group: string): SlotRef => ({ kind: 'winner', group })
const R = (group: string): SlotRef => ({ kind: 'runner', group })
const T = (rank: number): SlotRef => ({ kind: 'third', rank })
const WO = (tieId: string): SlotRef => ({ kind: 'winnerOf', tieId })
const LO = (tieId: string): SlotRef => ({ kind: 'loserOf', tieId })

// Dieciseisavos (16) — 8 izquierda, 8 derecha
const R32: TieDef[] = [
  { id: 'r32-1', round: 'round32', side: 'left', position: 0, home: W('A'), away: R('B') },
  { id: 'r32-2', round: 'round32', side: 'left', position: 1, home: W('C'), away: R('D') },
  { id: 'r32-3', round: 'round32', side: 'left', position: 2, home: W('E'), away: R('F') },
  { id: 'r32-4', round: 'round32', side: 'left', position: 3, home: T(0), away: T(7) },
  { id: 'r32-5', round: 'round32', side: 'left', position: 4, home: W('G'), away: R('H') },
  { id: 'r32-6', round: 'round32', side: 'left', position: 5, home: W('I'), away: R('J') },
  { id: 'r32-7', round: 'round32', side: 'left', position: 6, home: W('K'), away: R('L') },
  { id: 'r32-8', round: 'round32', side: 'left', position: 7, home: T(3), away: T(4) },
  { id: 'r32-9', round: 'round32', side: 'right', position: 0, home: W('B'), away: R('A') },
  { id: 'r32-10', round: 'round32', side: 'right', position: 1, home: W('D'), away: R('C') },
  { id: 'r32-11', round: 'round32', side: 'right', position: 2, home: W('F'), away: R('E') },
  { id: 'r32-12', round: 'round32', side: 'right', position: 3, home: T(1), away: T(6) },
  { id: 'r32-13', round: 'round32', side: 'right', position: 4, home: W('H'), away: R('G') },
  { id: 'r32-14', round: 'round32', side: 'right', position: 5, home: W('J'), away: R('I') },
  { id: 'r32-15', round: 'round32', side: 'right', position: 6, home: W('L'), away: R('K') },
  { id: 'r32-16', round: 'round32', side: 'right', position: 7, home: T(2), away: T(5) },
]

// Octavos (8)
const R16: TieDef[] = [
  { id: 'r16-1', round: 'round16', side: 'left', position: 0, home: WO('r32-1'), away: WO('r32-2') },
  { id: 'r16-2', round: 'round16', side: 'left', position: 1, home: WO('r32-3'), away: WO('r32-4') },
  { id: 'r16-3', round: 'round16', side: 'left', position: 2, home: WO('r32-5'), away: WO('r32-6') },
  { id: 'r16-4', round: 'round16', side: 'left', position: 3, home: WO('r32-7'), away: WO('r32-8') },
  { id: 'r16-5', round: 'round16', side: 'right', position: 0, home: WO('r32-9'), away: WO('r32-10') },
  { id: 'r16-6', round: 'round16', side: 'right', position: 1, home: WO('r32-11'), away: WO('r32-12') },
  { id: 'r16-7', round: 'round16', side: 'right', position: 2, home: WO('r32-13'), away: WO('r32-14') },
  { id: 'r16-8', round: 'round16', side: 'right', position: 3, home: WO('r32-15'), away: WO('r32-16') },
]

// Cuartos (4)
const QF: TieDef[] = [
  { id: 'qf-1', round: 'quarter', side: 'left', position: 0, home: WO('r16-1'), away: WO('r16-2') },
  { id: 'qf-2', round: 'quarter', side: 'left', position: 1, home: WO('r16-3'), away: WO('r16-4') },
  { id: 'qf-3', round: 'quarter', side: 'right', position: 0, home: WO('r16-5'), away: WO('r16-6') },
  { id: 'qf-4', round: 'quarter', side: 'right', position: 1, home: WO('r16-7'), away: WO('r16-8') },
]

// Semifinales (2)
const SF: TieDef[] = [
  { id: 'sf-1', round: 'semi', side: 'left', position: 0, home: WO('qf-1'), away: WO('qf-2') },
  { id: 'sf-2', round: 'semi', side: 'right', position: 0, home: WO('qf-3'), away: WO('qf-4') },
]

// Tercer puesto y Final
const FINALS: TieDef[] = [
  { id: 'third', round: 'third', side: 'center', position: 0, home: LO('sf-1'), away: LO('sf-2') },
  { id: 'final', round: 'final', side: 'center', position: 0, home: WO('sf-1'), away: WO('sf-2') },
]

export const BRACKET: TieDef[] = [...R32, ...R16, ...QF, ...SF, ...FINALS]

/** Etiqueta corta de la fase de la que proviene un cruce (para placeholders). */
export function roundShortLabel(tieId: string): string {
  if (tieId.startsWith('r32')) return 'de dieciseisavos'
  if (tieId.startsWith('r16')) return 'de octavos'
  if (tieId.startsWith('qf')) return 'de cuartos'
  if (tieId.startsWith('sf')) return 'de semifinal'
  return ''
}
