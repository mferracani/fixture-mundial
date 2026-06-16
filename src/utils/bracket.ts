import type { BracketSide, Stage } from '@/types'
import type { ThirdPlaceWinnerGroup } from './thirdPlaceRules'

// Estructura oficial FIFA del cuadro eliminatorio 2026.
// Los cruces contra terceros se resuelven con Annex C en thirdPlaceRules.ts.

export type SlotRef =
  | { kind: 'winner'; group: string }
  | { kind: 'runner'; group: string }
  | { kind: 'third'; winnerGroup: ThirdPlaceWinnerGroup }
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
const T = (winnerGroup: ThirdPlaceWinnerGroup): SlotRef => ({ kind: 'third', winnerGroup })
const WO = (tieId: string): SlotRef => ({ kind: 'winnerOf', tieId })
const LO = (tieId: string): SlotRef => ({ kind: 'loserOf', tieId })

// Dieciseisavos oficiales (matches 73 a 88), ordenados para respetar el bracket FIFA.
const R32: TieDef[] = [
  { id: 'r32-73', round: 'round32', side: 'left', position: 2, home: R('A'), away: R('B') },
  { id: 'r32-74', round: 'round32', side: 'left', position: 0, home: W('E'), away: T('E') },
  { id: 'r32-75', round: 'round32', side: 'left', position: 3, home: W('F'), away: R('C') },
  { id: 'r32-76', round: 'round32', side: 'right', position: 0, home: W('C'), away: R('F') },
  { id: 'r32-77', round: 'round32', side: 'left', position: 1, home: W('I'), away: T('I') },
  { id: 'r32-78', round: 'round32', side: 'right', position: 1, home: R('E'), away: R('I') },
  { id: 'r32-79', round: 'round32', side: 'right', position: 2, home: W('A'), away: T('A') },
  { id: 'r32-80', round: 'round32', side: 'right', position: 3, home: W('L'), away: T('L') },
  { id: 'r32-81', round: 'round32', side: 'left', position: 6, home: W('D'), away: T('D') },
  { id: 'r32-82', round: 'round32', side: 'left', position: 7, home: W('G'), away: T('G') },
  { id: 'r32-83', round: 'round32', side: 'left', position: 4, home: R('K'), away: R('L') },
  { id: 'r32-84', round: 'round32', side: 'left', position: 5, home: W('H'), away: R('J') },
  { id: 'r32-85', round: 'round32', side: 'right', position: 6, home: W('B'), away: T('B') },
  { id: 'r32-86', round: 'round32', side: 'right', position: 4, home: W('J'), away: R('H') },
  { id: 'r32-87', round: 'round32', side: 'right', position: 7, home: W('K'), away: T('K') },
  { id: 'r32-88', round: 'round32', side: 'right', position: 5, home: R('D'), away: R('G') },
]

// Octavos (8)
const R16: TieDef[] = [
  { id: 'r16-89', round: 'round16', side: 'left', position: 1, home: WO('r32-73'), away: WO('r32-75') },
  { id: 'r16-90', round: 'round16', side: 'left', position: 0, home: WO('r32-74'), away: WO('r32-77') },
  { id: 'r16-91', round: 'round16', side: 'right', position: 0, home: WO('r32-76'), away: WO('r32-78') },
  { id: 'r16-92', round: 'round16', side: 'right', position: 1, home: WO('r32-79'), away: WO('r32-80') },
  { id: 'r16-93', round: 'round16', side: 'left', position: 2, home: WO('r32-83'), away: WO('r32-84') },
  { id: 'r16-94', round: 'round16', side: 'left', position: 3, home: WO('r32-81'), away: WO('r32-82') },
  { id: 'r16-95', round: 'round16', side: 'right', position: 2, home: WO('r32-86'), away: WO('r32-88') },
  { id: 'r16-96', round: 'round16', side: 'right', position: 3, home: WO('r32-85'), away: WO('r32-87') },
]

// Cuartos (4)
const QF: TieDef[] = [
  { id: 'qf-97', round: 'quarter', side: 'left', position: 0, home: WO('r16-89'), away: WO('r16-90') },
  { id: 'qf-98', round: 'quarter', side: 'left', position: 1, home: WO('r16-93'), away: WO('r16-94') },
  { id: 'qf-99', round: 'quarter', side: 'right', position: 0, home: WO('r16-91'), away: WO('r16-92') },
  { id: 'qf-100', round: 'quarter', side: 'right', position: 1, home: WO('r16-95'), away: WO('r16-96') },
]

// Semifinales (2)
const SF: TieDef[] = [
  { id: 'sf-101', round: 'semi', side: 'left', position: 0, home: WO('qf-97'), away: WO('qf-98') },
  { id: 'sf-102', round: 'semi', side: 'right', position: 0, home: WO('qf-99'), away: WO('qf-100') },
]

// Tercer puesto y Final
const FINALS: TieDef[] = [
  { id: 'third', round: 'third', side: 'center', position: 0, home: LO('sf-101'), away: LO('sf-102') },
  { id: 'final', round: 'final', side: 'center', position: 0, home: WO('sf-101'), away: WO('sf-102') },
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
