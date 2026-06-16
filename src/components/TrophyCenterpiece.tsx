import { useState } from 'react'
import { motion } from 'framer-motion'

interface TrophyCenterpieceProps {
  size?: number
  className?: string
}

/**
 * Imagen de la Copa del Mundo para el centro del bracket.
 * Intenta cargar el asset propio `/assets/world-cup-trophy.webp`; si no existe,
 * cae al placeholder premium con silueta abstracta `/assets/world-cup-trophy.svg`.
 * Siempre con alt text accesible.
 */
export function TrophyCenterpiece({ size = 200, className = '' }: TrophyCenterpieceProps) {
  const [src, setSrc] = useState('/assets/world-cup-trophy.webp')

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.7,
          height: size * 1.7,
          background:
            'radial-gradient(circle, rgba(217,181,74,0.22) 0%, rgba(217,181,74,0.06) 40%, transparent 70%)',
        }}
      />
      <motion.img
        src={src}
        onError={() => {
          if (!src.endsWith('.svg')) setSrc('/assets/world-cup-trophy.svg')
        }}
        alt="Trofeo de la Copa del Mundo"
        width={size}
        height={size * 1.45}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: [0, -8, 0], opacity: 1 }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.8 },
        }}
        className="drop-shadow-[0_20px_40px_rgba(217,181,74,0.25)]"
        style={{ width: size, height: 'auto' }}
      />
    </div>
  )
}
