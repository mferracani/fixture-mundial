import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import type { Group, KnockoutTie } from '@/types'
import { EmptyState } from '@/components/EmptyState'
import { buildAgenda, pickDefaultDay } from '@/utils/agenda'
import { formatDayHeading, todayKeyArgentina } from '@/utils/date'
import { MatchRow } from './MatchRow'

interface AgendaViewProps {
  groups: Group[]
  knockout: KnockoutTie[]
}

/**
 * Agenda diaria: al abrir muestra los partidos de hoy con su horario en hora de
 * Argentina, los ya jugados con su resultado y los próximos sin marcador. El
 * selector superior permite moverse por día. Optimizada para mobile.
 */
export function AgendaView({ groups, knockout }: AgendaViewProps) {
  const days = useMemo(() => buildAgenda(groups, knockout), [groups, knockout])
  const todayKey = useMemo(() => todayKeyArgentina(), [])
  const defaultKey = useMemo(() => pickDefaultDay(days, todayKey), [days, todayKey])

  const [selected, setSelected] = useState<string | null>(null)
  const selectedKey = selected ?? defaultKey
  const selectedDay = days.find((d) => d.key === selectedKey) ?? null

  const stripRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Centrar el día seleccionado en el carrusel al montar / cambiar (cálculo
  // directo de scrollLeft: confiable y sin afectar el scroll vertical).
  useEffect(() => {
    if (!selectedKey) return
    const chip = chipRefs.current[selectedKey]
    const strip = stripRef.current
    if (!chip || !strip) return
    const target = chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2
    strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [selectedKey])

  if (days.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay partidos programados."
        description="Cuando se confirmen las fechas, vas a ver acá la agenda día por día."
      />
    )
  }

  const hasToday = days.some((d) => d.key === todayKey)

  return (
    <section aria-labelledby="agenda-title" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-cream/75">
          <CalendarDays size={18} className="text-gold-200/80" aria-hidden />
          <h2 id="agenda-title" className="font-display text-lg font-bold text-cream">
            Partidos por día
          </h2>
        </div>
        {hasToday && selectedKey !== todayKey && (
          <button
            type="button"
            onClick={() => setSelected(todayKey)}
            className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-200 transition-colors hover:bg-gold-400/20"
          >
            Ir a hoy
          </button>
        )}
      </div>

      {/* Carrusel de días */}
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Seleccionar día"
        className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {days.map((d) => {
          const isSelected = d.key === selectedKey
          const isToday = d.key === todayKey
          return (
            <button
              key={d.key}
              ref={(el) => {
                chipRefs.current[d.key] = el
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelected(d.key)}
              className={`relative flex w-14 shrink-0 flex-col items-center rounded-xl border px-1 py-2 transition-colors ${
                isSelected
                  ? 'border-transparent bg-gold-gradient text-night-950 shadow-gold-glow'
                  : isToday
                    ? 'border-gold-400/40 bg-white/[0.03] text-cream'
                    : 'border-white/[0.07] bg-white/[0.02] text-cream/60 hover:border-white/15 hover:text-cream'
              }`}
            >
              <span className="text-[0.62rem] font-semibold uppercase tracking-wide">
                {d.weekday}
              </span>
              <span className="text-base font-bold leading-tight">{d.day}</span>
              <span
                className={`text-[0.58rem] uppercase ${isSelected ? 'text-night-950/70' : 'text-cream/40'}`}
              >
                {d.month}
              </span>
              {/* Punto: indica partidos jugados (verde) o programados */}
              <span
                aria-hidden
                className={`mt-1 h-1.5 w-1.5 rounded-full ${
                  isSelected
                    ? 'bg-night-950/60'
                    : d.finishedCount > 0
                      ? 'bg-pitch-500'
                      : 'bg-cream/25'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Día seleccionado */}
      {selectedDay && (
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h3 className="font-display text-base font-bold text-cream">
              {selectedKey === todayKey && <span className="text-gold-300">Hoy · </span>}
              {formatDayHeading(selectedDay.key)}
            </h3>
            <span className="shrink-0 text-xs text-cream/45">
              {selectedDay.matches.length} partido{selectedDay.matches.length === 1 ? '' : 's'}
              {selectedDay.finishedCount > 0 && ` · ${selectedDay.finishedCount} jugado${selectedDay.finishedCount === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {selectedDay.matches.map((item) => (
              <MatchRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
