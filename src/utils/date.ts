import { formatInTimeZone } from 'date-fns-tz'
import { es } from 'date-fns/locale'

export const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires'
export const SPAIN_TZ = 'Europe/Madrid'

const SPAIN_TIME_START = '2026-06-24'
const SPAIN_TIME_END = '2026-07-12'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function shouldShowSpainTime(utcIso: string): boolean {
  const argentinaDate = formatInTimeZone(utcIso, ARGENTINA_TZ, 'yyyy-MM-dd')
  return argentinaDate >= SPAIN_TIME_START && argentinaDate <= SPAIN_TIME_END
}

/**
 * Formatea un kickoff UTC a la hora de Argentina con formato editorial.
 * Ejemplo: "Lun 15 Jun · 16:00 ARG"
 */
export function formatKickoffArgentina(utcIso: string): string {
  try {
    const day = capitalize(formatInTimeZone(utcIso, ARGENTINA_TZ, 'EEE', { locale: es }))
    const date = formatInTimeZone(utcIso, ARGENTINA_TZ, "d", { locale: es })
    const month = capitalize(formatInTimeZone(utcIso, ARGENTINA_TZ, 'MMM', { locale: es }))
    const time = formatInTimeZone(utcIso, ARGENTINA_TZ, 'HH:mm', { locale: es })
    const spainTime = shouldShowSpainTime(utcIso)
      ? ` (${formatInTimeZone(utcIso, SPAIN_TZ, 'HH:mm', { locale: es })} ESP)`
      : ''
    return `${day} ${date} ${month} · ${time} ARG${spainTime}`
  } catch {
    return 'Fecha a confirmar'
  }
}

/** Solo la hora: "16:00" */
export function formatTimeArgentina(utcIso: string): string {
  try {
    return formatInTimeZone(utcIso, ARGENTINA_TZ, 'HH:mm', { locale: es })
  } catch {
    return '--:--'
  }
}

/** Solo el día: "Lun 15 Jun" */
export function formatDayArgentina(utcIso: string): string {
  try {
    const day = capitalize(formatInTimeZone(utcIso, ARGENTINA_TZ, 'EEE', { locale: es }))
    const date = formatInTimeZone(utcIso, ARGENTINA_TZ, 'd', { locale: es })
    const month = capitalize(formatInTimeZone(utcIso, ARGENTINA_TZ, 'MMM', { locale: es }))
    return `${day} ${date} ${month}`
  } catch {
    return 'Fecha a confirmar'
  }
}

/** "HH:mm" de un instante dado (default: ahora) para "Última actualización". */
export function formatUpdatedAt(utcIso: string): string {
  try {
    return formatInTimeZone(utcIso, ARGENTINA_TZ, 'HH:mm', { locale: es })
  } catch {
    return '--:--'
  }
}
