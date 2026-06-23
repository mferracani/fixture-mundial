import { motion } from 'framer-motion'
import { CalendarDays, LayoutGrid, GitMerge } from 'lucide-react'

export type Section = 'agenda' | 'groups' | 'knockout'

interface TopNavigationProps {
  active: Section
  onChange: (section: Section) => void
}

const TABS: { id: Section; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'agenda', label: 'Por día', icon: CalendarDays },
  { id: 'groups', label: 'Grupos', icon: LayoutGrid },
  { id: 'knockout', label: 'Eliminatorias', icon: GitMerge },
]

/**
 * Navegación entre las secciones principales. En mobile es un control segmentado
 * a todo el ancho (3 segmentos iguales, sin que el texto se parta); en desktop
 * es una píldora compacta al lado del logo.
 */
export function TopNavigation({ active, onChange }: TopNavigationProps) {
  return (
    <nav
      aria-label="Secciones principales"
      className="glass-soft flex w-full items-center gap-1 rounded-full p-1 sm:inline-flex sm:w-auto"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[0.82rem] font-semibold transition-colors duration-200 sm:flex-initial sm:px-5 sm:py-2 sm:text-sm ${
              isActive ? 'text-night-950' : 'text-cream/60 hover:text-cream'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-full bg-gold-gradient shadow-gold-glow"
              />
            )}
            <Icon size={16} className="hidden shrink-0 sm:inline-block" aria-hidden />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
