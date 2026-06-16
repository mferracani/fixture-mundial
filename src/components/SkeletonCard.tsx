/** Bloque base con shimmer. */
function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-white/[0.05] ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  )
}

/** Skeleton premium de una card de grupo (tabla + partidos). */
export function SkeletonCard() {
  return (
    <div className="glass p-5" aria-hidden>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer className="h-9 w-9 rounded-xl" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-3 w-32" />
          </div>
        </div>
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Shimmer className="h-5 w-5 rounded" />
            <Shimmer className="h-4 flex-1" />
            <Shimmer className="h-4 w-8" />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 border-t border-white/[0.05] pt-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Shimmer key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

/** Grilla de skeletons para el loading inicial. */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
