import type { WorldCupData } from '@/types'

/**
 * Contrato que todo proveedor de datos debe cumplir.
 * Implementaciones: MockAdapter (local) y ApiAdapter (proveedor real).
 */
export interface WorldCupDataAdapter {
  readonly name: string
  fetchAll(signal?: AbortSignal): Promise<WorldCupData>
}
