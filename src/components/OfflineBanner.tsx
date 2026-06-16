import { AnimatePresence, motion } from 'framer-motion'
import { CloudOff } from 'lucide-react'

/** Banner superior cuando no hay conexión. */
export function OfflineBanner({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="status"
          aria-live="polite"
          className="overflow-hidden border-b border-amber-400/20 bg-amber-500/10 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-sm text-amber-200">
            <CloudOff size={15} aria-hidden />
            <span>Estás sin conexión. Mostramos la última información guardada.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
