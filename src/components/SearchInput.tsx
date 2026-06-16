import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/** Buscador por país o grupo. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar país o grupo…',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40"
      />
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar país o grupo"
        className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm text-cream
          placeholder:text-cream/35 transition-colors focus:border-gold-300/40 focus:bg-white/[0.06]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-cream/45 transition-colors hover:bg-white/10 hover:text-cream"
        >
          <X size={14} aria-hidden />
        </button>
      )}
    </div>
  )
}
