import { formatInTimeZone } from 'date-fns-tz'
import { es } from 'date-fns/locale'

export const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

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
    return `${day} ${date} ${month} · ${time} ARG`
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
