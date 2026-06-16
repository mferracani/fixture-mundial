import { motion } from 'framer-motion'
import { LayoutGrid, GitMerge } from 'lucide-react'

export type Section = 'groups' | 'knockout'

interface TopNavigationProps {
  active: Section
  onChange: (section: Section) => void
}

const TABS: { id: Section; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'groups', label: 'Grupos', icon: LayoutGrid },
  { id: 'knockout', label: 'Eliminatorias', icon: GitMerge },
]

/** Navegación superior entre las 2 secciones principales. */
export function TopNavigation({ active, onChange }: TopNavigationProps) {
  return (
    <nav
      aria-label="Secciones principales"
      className="glass-soft inline-flex items-center gap-1 rounded-full p-1"
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
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 sm:px-5 ${
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
            <Icon size={16} aria-hidden />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
