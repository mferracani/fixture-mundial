export interface KnockoutScheduleEntry {
  kickoffUtc: string
  stadium: string
  city: string
}

export const KNOCKOUT_SCHEDULE: Record<string, KnockoutScheduleEntry> = {
  'r32-73': { kickoffUtc: '2026-06-28T19:00:00.000Z', stadium: 'SoFi Stadium', city: 'Inglewood' },
  'r32-74': { kickoffUtc: '2026-06-29T20:30:00.000Z', stadium: 'Gillette Stadium', city: 'Foxborough' },
  'r32-75': { kickoffUtc: '2026-06-30T01:00:00.000Z', stadium: 'Estadio BBVA', city: 'Guadalupe' },
  'r32-76': { kickoffUtc: '2026-06-29T17:00:00.000Z', stadium: 'NRG Stadium', city: 'Houston' },
  'r32-77': { kickoffUtc: '2026-06-30T21:00:00.000Z', stadium: 'MetLife Stadium', city: 'East Rutherford' },
  'r32-78': { kickoffUtc: '2026-06-30T17:00:00.000Z', stadium: 'AT&T Stadium', city: 'Arlington' },
  'r32-79': { kickoffUtc: '2026-07-01T01:00:00.000Z', stadium: 'Estadio Azteca', city: 'Mexico City' },
  'r32-80': { kickoffUtc: '2026-07-01T16:00:00.000Z', stadium: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  'r32-81': { kickoffUtc: '2026-07-02T00:00:00.000Z', stadium: "Levi's Stadium", city: 'Santa Clara' },
  'r32-82': { kickoffUtc: '2026-07-01T20:00:00.000Z', stadium: 'Lumen Field', city: 'Seattle' },
  'r32-83': { kickoffUtc: '2026-07-02T23:00:00.000Z', stadium: 'BMO Field', city: 'Toronto' },
  'r32-84': { kickoffUtc: '2026-07-02T19:00:00.000Z', stadium: 'SoFi Stadium', city: 'Inglewood' },
  'r32-85': { kickoffUtc: '2026-07-03T03:00:00.000Z', stadium: 'BC Place', city: 'Vancouver' },
  'r32-86': { kickoffUtc: '2026-07-03T22:00:00.000Z', stadium: 'Hard Rock Stadium', city: 'Miami Gardens' },
  'r32-87': { kickoffUtc: '2026-07-04T01:30:00.000Z', stadium: 'Arrowhead Stadium', city: 'Kansas City' },
  'r32-88': { kickoffUtc: '2026-07-03T18:00:00.000Z', stadium: 'AT&T Stadium', city: 'Arlington' },
  'r16-89': { kickoffUtc: '2026-07-04T21:00:00.000Z', stadium: 'Lincoln Financial Field', city: 'Philadelphia' },
  'r16-90': { kickoffUtc: '2026-07-04T17:00:00.000Z', stadium: 'NRG Stadium', city: 'Houston' },
  'r16-91': { kickoffUtc: '2026-07-05T20:00:00.000Z', stadium: 'MetLife Stadium', city: 'East Rutherford' },
  'r16-92': { kickoffUtc: '2026-07-06T00:00:00.000Z', stadium: 'Estadio Azteca', city: 'Mexico City' },
  'r16-93': { kickoffUtc: '2026-07-06T19:00:00.000Z', stadium: 'AT&T Stadium', city: 'Arlington' },
  'r16-94': { kickoffUtc: '2026-07-07T00:00:00.000Z', stadium: 'Lumen Field', city: 'Seattle' },
  'r16-95': { kickoffUtc: '2026-07-07T16:00:00.000Z', stadium: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  'r16-96': { kickoffUtc: '2026-07-07T20:00:00.000Z', stadium: 'BC Place', city: 'Vancouver' },
  'qf-97': { kickoffUtc: '2026-07-09T20:00:00.000Z', stadium: 'Gillette Stadium', city: 'Foxborough' },
  'qf-98': { kickoffUtc: '2026-07-10T19:00:00.000Z', stadium: 'SoFi Stadium', city: 'Inglewood' },
  'qf-99': { kickoffUtc: '2026-07-11T21:00:00.000Z', stadium: 'Hard Rock Stadium', city: 'Miami Gardens' },
  'qf-100': { kickoffUtc: '2026-07-12T01:00:00.000Z', stadium: 'Arrowhead Stadium', city: 'Kansas City' },
  'sf-101': { kickoffUtc: '2026-07-14T19:00:00.000Z', stadium: 'AT&T Stadium', city: 'Arlington' },
  'sf-102': { kickoffUtc: '2026-07-15T19:00:00.000Z', stadium: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  third: { kickoffUtc: '2026-07-18T21:00:00.000Z', stadium: 'Hard Rock Stadium', city: 'Miami Gardens' },
  final: { kickoffUtc: '2026-07-19T19:00:00.000Z', stadium: 'MetLife Stadium', city: 'East Rutherford' },
}
