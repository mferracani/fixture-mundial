import type { ReactNode } from 'react'
import { TopNavigation, type Section } from './TopNavigation'
import { OfflineBanner } from './OfflineBanner'

interface AppShellProps {
  section: Section
  onSectionChange: (s: Section) => void
  offline: boolean
  children: ReactNode
}

/** Estructura general: barra superior sticky, banner offline, contenido y footer. */
export function AppShell({ section, onSectionChange, offline, children }: AppShellProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Barra superior sticky */}
      <div className="sticky top-0 z-40">
        <OfflineBanner show={offline} />
        <div className="border-b border-white/[0.06] bg-night-950/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
            <a href="#" className="flex items-center gap-2.5 self-start" aria-label="Mundial 2026 — inicio">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient text-night-950">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
                  <circle cx="16" cy="12" r="7" />
                  <path d="M11 19h10l-2 5h-6l-2-5Z" />
                  <rect x="10" y="24" width="12" height="3" rx="1.5" />
                </svg>
              </span>
              <span className="font-display text-sm font-bold tracking-tight text-cream">
                Mundial<span className="text-gold-300">26</span>
              </span>
            </a>
            <TopNavigation active={section} onChange={onSectionChange} />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-20 sm:px-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 text-center text-xs text-cream/35 sm:px-6">
          <p>
            Horarios en hora de Argentina (America/Argentina/Buenos_Aires). Datos de demostración
            reemplazables por una API real.
          </p>
          <p>Hecho con pasión futbolera · Mundial 2026</p>
        </div>
      </footer>
    </div>
  )
}
