import type { WorldCupData } from '@/types'
import type { WorldCupDataAdapter } from './types'
import mock from '@/data/worldcup-2026.mock.json'

/**
 * Adaptador local. Sirve el archivo mock empaquetado.
 * Simula una latencia de red mínima para ejercitar los estados de loading.
 * En cada fetch refresca `lastUpdatedUtc` para que "Última actualización" avance.
 */
export class MockAdapter implements WorldCupDataAdapter {
  readonly name = 'mock'

  async fetchAll(signal?: AbortSignal): Promise<WorldCupData> {
    await new Promise((resolve, reject) => {
      const t = setTimeout(resolve, 350)
      signal?.addEventListener('abort', () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })

    const data = mock as unknown as WorldCupData
    return {
      ...data,
      lastUpdatedUtc: new Date().toISOString(),
    }
  }
}
