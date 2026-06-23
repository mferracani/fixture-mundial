import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'mundial2026:settings:v1'

interface Settings {
  /** Autocompletar los resultados reales desde openfootball. */
  autoComplete: boolean
}

const DEFAULTS: Settings = { autoComplete: true }

interface SettingsContextValue extends Settings {
  setAutoComplete: (value: boolean) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function loadInitial(): Settings {
  if (typeof localStorage === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }, [settings])

  const setAutoComplete = useCallback(
    (value: boolean) => setSettings((s) => ({ ...s, autoComplete: value })),
    [],
  )

  const value = useMemo(() => ({ ...settings, setAutoComplete }), [settings, setAutoComplete])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings debe usarse dentro de <SettingsProvider>')
  return ctx
}

// --- Contexto de datos reales -------------------------------------------------
// Permite que las cards sepan qué marcador proviene de la fuente real (para
// mostrar un distintivo y bloquear la edición) sin pasar props por todo el árbol.

interface RealDataValue {
  autoComplete: boolean
  realIds: Set<string>
}

const EMPTY_REAL: RealDataValue = { autoComplete: false, realIds: new Set() }

const RealDataContext = createContext<RealDataValue>(EMPTY_REAL)

export function RealDataProvider({
  value,
  children,
}: {
  value: RealDataValue
  children: ReactNode
}) {
  return <RealDataContext.Provider value={value}>{children}</RealDataContext.Provider>
}

export function useRealData(): RealDataValue {
  return useContext(RealDataContext)
}
