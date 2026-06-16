interface LiveIndicatorProps {
  minute?: number | null
  halftime?: boolean
  className?: string
}

/** Punto rojo pulsante + minuto de juego. No depende solo del color. */
export function LiveIndicator({ minute, halftime, className = '' }: LiveIndicatorProps) {
  const label = halftime ? 'ET' : minute != null ? `${minute}'` : 'EN VIVO'
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={halftime ? 'Entretiempo' : minute != null ? `En vivo, minuto ${minute}` : 'En vivo'}
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      <span className="tnum text-xs font-bold uppercase tracking-wide text-red-300">
        {label}
      </span>
    </span>
  )
}
