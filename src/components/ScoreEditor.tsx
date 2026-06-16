import { useId } from 'react'

interface ScoreEditorProps {
  homeScore: number | null
  awayScore: number | null
  onChange: (home: number | null, away: number | null) => void
  homeLabel?: string
  awayLabel?: string
  /** Inputs de penales (se muestran cuando hay empate) */
  penalties?: {
    home: number | null
    away: number | null
    onChange: (home: number | null, away: number | null) => void
  }
  size?: 'sm' | 'md'
}

function parse(v: string): number | null {
  if (v === '') return null
  const n = Math.max(0, Math.min(99, Math.floor(Number(v))))
  return Number.isFinite(n) ? n : null
}

/** Editor de marcador: dos inputs numéricos con guion al medio. */
export function ScoreEditor({
  homeScore,
  awayScore,
  onChange,
  homeLabel = 'Goles local',
  awayLabel = 'Goles visitante',
  penalties,
  size = 'md',
}: ScoreEditorProps) {
  const id = useId()
  const box =
    size === 'sm'
      ? 'h-8 w-9 text-base'
      : 'h-10 w-11 text-lg'

  const isDraw = homeScore != null && awayScore != null && homeScore === awayScore

  const inputCls = `${box} tnum rounded-lg border border-white/12 bg-night-900/80 text-center font-bold tabular-nums text-cream
    transition-colors focus:border-gold-300/60 focus:bg-night-800
    [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1.5">
        <input
          id={`${id}-h`}
          type="number"
          inputMode="numeric"
          min={0}
          max={99}
          aria-label={homeLabel}
          value={homeScore ?? ''}
          onChange={(e) => onChange(parse(e.target.value), awayScore)}
          placeholder="–"
          className={inputCls}
        />
        <span className="text-cream/30" aria-hidden>
          —
        </span>
        <input
          id={`${id}-a`}
          type="number"
          inputMode="numeric"
          min={0}
          max={99}
          aria-label={awayLabel}
          value={awayScore ?? ''}
          onChange={(e) => onChange(homeScore, parse(e.target.value))}
          placeholder="–"
          className={inputCls}
        />
      </div>

      {/* Penales: solo en eliminatoria con empate */}
      {penalties && isDraw && (
        <div className="flex items-center gap-1.5">
          <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-gold-200/70">Pen</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={30}
            aria-label="Penales local"
            value={penalties.home ?? ''}
            onChange={(e) => penalties.onChange(parse(e.target.value), penalties.away)}
            placeholder="–"
            className="tnum h-6 w-7 rounded-md border border-gold-300/25 bg-night-900/80 text-center text-xs font-bold tabular-nums text-gold-100 focus:border-gold-300/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-cream/30 text-xs" aria-hidden>
            —
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={30}
            aria-label="Penales visitante"
            value={penalties.away ?? ''}
            onChange={(e) => penalties.onChange(penalties.home, parse(e.target.value))}
            placeholder="–"
            className="tnum h-6 w-7 rounded-md border border-gold-300/25 bg-night-900/80 text-center text-xs font-bold tabular-nums text-gold-100 focus:border-gold-300/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      )}
    </div>
  )
}
