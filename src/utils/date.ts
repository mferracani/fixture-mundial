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

/**
 * Hora de España ("16:00") solo para los partidos entre el 24/6 y el 12/7
 * (período en que el usuario está en España). Devuelve null fuera de ese rango.
 */
export function spainTimeInWindow(utcIso: string): string | null {
  try {
    if (!shouldShowSpainTime(utcIso)) return null
    return formatInTimeZone(utcIso, SPAIN_TZ, 'HH:mm', { locale: es })
  } catch {
    return null
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

// ---- Agrupación por día (hora de Argentina) ----

/** Clave de día en hora de Argentina: "2026-06-23". */
export function dayKeyArgentina(utcIso: string): string {
  return formatInTimeZone(utcIso, ARGENTINA_TZ, 'yyyy-MM-dd')
}

/** Clave del día de hoy en hora de Argentina. */
export function todayKeyArgentina(): string {
  return formatInTimeZone(new Date(), ARGENTINA_TZ, 'yyyy-MM-dd')
}

/** Etiqueta corta para el selector de días: { weekday: "Mar", day: "23", month: "Jun" }. */
export function dayChipParts(dayKey: string): { weekday: string; day: string; month: string } {
  const iso = `${dayKey}T12:00:00.000Z` // mediodía UTC: el día calendario en ARG no cambia
  return {
    weekday: capitalize(formatInTimeZone(iso, ARGENTINA_TZ, 'EEE', { locale: es })),
    day: formatInTimeZone(iso, ARGENTINA_TZ, 'd', { locale: es }),
    month: capitalize(formatInTimeZone(iso, ARGENTINA_TZ, 'MMM', { locale: es })),
  }
}

/** Encabezado largo del día: "Martes 23 de junio". */
export function formatDayHeading(dayKey: string): string {
  const iso = `${dayKey}T12:00:00.000Z`
  try {
    return capitalize(formatInTimeZone(iso, ARGENTINA_TZ, "EEEE d 'de' MMMM", { locale: es }))
  } catch {
    return dayKey
  }
}
