import { CheckCircle2, Info, Loader2, RotateCcw, TriangleAlert } from 'lucide-react'

interface AutoCompleteBarProps {
  autoComplete: boolean
  onToggle: (value: boolean) => void
  isFetching: boolean
  isError: boolean
  appliedCount: number
  fetchedAt: string | null
  /** Resultados cargados manualmente (para el botón de reinicio). */
  manualCount: number
  onClearManual: () => void
}

function formatArg(iso: string | null): string | null {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires',
    })
  } catch {
    return null
  }
}

/** Interruptor accesible (role="switch"). */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Autocompletar resultados reales"
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        on ? 'bg-gold-gradient shadow-gold-glow' : 'bg-white/12'
      }`}
    >
      <span
        className={`inline-block h-[1.125rem] w-[1.125rem] transform rounded-full bg-night-950 shadow transition-transform ${
          on ? 'translate-x-[1.45rem]' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

/**
 * Banner de control del autocompletado: activa/desactiva la carga automática de
 * resultados reales (openfootball) y muestra el estado de sincronización.
 */
export function AutoCompleteBar({
  autoComplete,
  onToggle,
  isFetching,
  isError,
  appliedCount,
  fetchedAt,
  manualCount,
  onClearManual,
}: AutoCompleteBarProps) {
  const time = formatArg(fetchedAt)

  return (
    <div
      className={`mt-6 flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm transition-colors sm:flex-row sm:items-center sm:justify-between ${
        autoComplete
          ? 'border-gold-400/25 bg-gold-400/[0.06]'
          : 'border-sky2-400/20 bg-sky2-400/[0.07]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {autoComplete ? (
          isError ? (
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
          ) : isFetching ? (
            <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin text-gold-300" aria-hidden />
          ) : (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-300" aria-hidden />
          )
        ) : (
          <Info size={16} className="mt-0.5 shrink-0 text-sky2-300" aria-hidden />
        )}

        {autoComplete ? (
          <p className="text-cream/75">
            <strong className="font-semibold text-cream">Autocompletado activado.</strong>{' '}
            {isError ? (
              <span className="text-amber-200/90">
                No pudimos sincronizar con la fuente. Mostramos lo último disponible.
              </span>
            ) : (
              <>
                Los resultados reales se cargan solos desde{' '}
                <a
                  href="https://github.com/openfootball/worldcup.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold-200 underline decoration-gold-400/40 underline-offset-2 hover:text-gold-100"
                >
                  openfootball
                </a>{' '}
                y pisan tus predicciones jugadas.{' '}
                <span className="whitespace-nowrap text-cream/55">
                  {appliedCount} cargados{time ? ` · ${time} ARG` : ''}
                  {isFetching ? ' · actualizando…' : ''}
                </span>
              </>
            )}
          </p>
        ) : (
          <p className="text-cream/75">
            <strong className="font-semibold text-cream">Modo predicción.</strong> Cargá vos los
            goles: las posiciones se recalculan solas (reglas FIFA) y el bracket se va completando.
            Se guardan en este navegador.
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto">
        {manualCount > 0 && (
          <button
            type="button"
            onClick={onClearManual}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-cream/70 transition-colors hover:border-red-400/40 hover:text-red-200"
          >
            <RotateCcw size={13} aria-hidden /> Reiniciar mis goles ({manualCount})
          </button>
        )}
        <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-cream/70">
          <span>Auto</span>
          <Toggle on={autoComplete} onChange={onToggle} />
        </label>
      </div>
    </div>
  )
}
