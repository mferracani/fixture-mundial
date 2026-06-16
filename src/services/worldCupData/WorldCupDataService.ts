import type { WorldCupData } from '@/types'
import type { WorldCupDataAdapter } from './types'
import { MockAdapter } from './mockAdapter'
import { ApiAdapter } from './apiAdapter'

/**
 * Servicio de datos del Mundial, desacoplado de la UI.
 *
 * Prioridad de datos:
 *   1. API real si `VITE_SPORTS_API_BASE_URL` está configurada.
 *   2. Mock local en caso contrario.
 *
 * La UI consume siempre este servicio (vía TanStack Query), nunca un adaptador
 * concreto ni datos hardcodeados.
 */
export class WorldCupDataService {
  private readonly adapter: WorldCupDataAdapter

  constructor(adapter?: WorldCupDataAdapter) {
    this.adapter = adapter ?? WorldCupDataService.resolveAdapter()
  }

  get source(): string {
    return this.adapter.name
  }

  fetchAll(signal?: AbortSignal): Promise<WorldCupData> {
    return this.adapter.fetchAll(signal)
  }

  private static resolveAdapter(): WorldCupDataAdapter {
    const baseUrl = import.meta.env.VITE_SPORTS_API_BASE_URL as string | undefined
    const apiKey = import.meta.env.VITE_SPORTS_API_KEY as string | undefined

    if (baseUrl && baseUrl.trim().length > 0) {
      return new ApiAdapter(baseUrl, apiKey)
    }
    return new MockAdapter()
  }
}

// Instancia compartida para toda la app.
export const worldCupDataService = new WorldCupDataService()
