import { useState } from 'react'
import type { Team } from '@/types'

interface FlagProps {
  team?: Team | null
  /** Tamaño en px del lado mayor */
  size?: number
  className?: string
}

/**
 * Bandera de país. Usa imagen de bandera cuando está disponible y cae al
 * emoji si la imagen falla. Siempre lleva texto alternativo con el país.
 */
export function Flag({ team, size = 22, className = '' }: FlagProps) {
  const [imgFailed, setImgFailed] = useState(false)

  const alt = team ? `Bandera de ${team.name}` : 'Equipo por definir'

  if (!team) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`inline-flex shrink-0 items-center justify-center rounded-[5px] border border-white/10 bg-white/[0.04] text-cream/30 ${className}`}
        style={{ width: size * 1.34, height: size }}
      >
        <span aria-hidden className="text-[0.7em] font-bold">
          ?
        </span>
      </span>
    )
  }

  const showImg = team.flagUrl && !imgFailed

  return (
    <span
      role="img"
      aria-label={alt}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[5px] shadow-sm ring-1 ring-black/30 ${className}`}
      style={{ width: size * 1.34, height: size }}
    >
      {/* Emoji siempre presente como fondo: evita cajas vacías mientras carga
          la imagen del CDN y funciona offline. La imagen la cubre al cargar. */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-white/[0.04] leading-none"
        style={{ fontSize: size * 0.82 }}
      >
        {team.flagEmoji}
      </span>
      {showImg && (
        <img
          src={team.flagUrl}
          alt=""
          loading="lazy"
          width={Math.round(size * 1.34)}
          height={size}
          onError={() => setImgFailed(true)}
          className="relative h-full w-full object-cover"
        />
      )}
    </span>
  )
}
