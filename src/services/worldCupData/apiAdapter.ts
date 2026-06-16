import type { WorldCupData } from '@/types'
import type { WorldCupDataAdapter } from './types'

/**
 * Adaptador para un proveedor de datos deportivos real.
 *
 * Este adaptador asume que el backend del proveedor (o un proxy propio)
 * expone un endpoint que devuelve datos ya normalizados al modelo
 * `WorldCupData`. Si el proveedor usa otro esquema, este es el único lugar
 * donde hay que mapear: la UI nunca toca el formato crudo del proveedor.
 *
 * Se activa automáticamente cuando `VITE_SPORTS_API_BASE_URL` está definido.
 */
export class ApiAdapter implements WorldCupDataAdapter {
  readonly name = 'api'

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {}

  async fetchAll(signal?: AbortSignal): Promise<WorldCupData> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/worldcup-2026`
    const res = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
    })

    if (!res.ok) {
      throw new Error(`Proveedor respondió ${res.status} ${res.statusText}`)
    }

    const raw = (await res.json()) as WorldCupData
    return this.normalize(raw)
  }

  /**
   * Punto de extensión: normalizar el payload del proveedor al modelo interno.
   * Por defecto se asume que ya viene en el formato correcto.
   */
  private normalize(raw: WorldCupData): WorldCupData {
    return raw
  }
}
