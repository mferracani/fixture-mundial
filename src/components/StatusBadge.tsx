import type { ReactNode } from 'react'

type Tone = 'gold' | 'live' | 'green' | 'neutral' | 'sky'

const TONES: Record<Tone, string> = {
  gold: 'border-gold-300/40 bg-gold-300/10 text-gold-100',
  live: 'border-red-400/40 bg-red-500/15 text-red-200',
  green: 'border-pitch-400/40 bg-pitch-500/12 text-pitch-400',
  sky: 'border-sky2-400/40 bg-sky2-400/12 text-sky2-300',
  neutral: 'border-white/12 bg-white/[0.05] text-cream/70',
}

interface StatusBadgeProps {
  tone?: Tone
  children: ReactNode
  icon?: ReactNode
  className?: string
  pulse?: boolean
}

/** Badge genérico de estado con tono semántico. */
export function StatusBadge({
  tone = 'neutral',
  children,
  icon,
  className = '',
  pulse = false,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${TONES[tone]} ${className}`}
    >
      {icon ? (
        <span className={`flex items-center ${pulse ? 'animate-pulse' : ''}`} aria-hidden>
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  )
}
