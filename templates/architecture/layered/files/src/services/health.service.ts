import { readHealthSnapshot } from '../repositories/health.repository.js'
import type { HealthStatus } from '../schemas/health.js'

export function getHealthStatus(): HealthStatus {
  const snapshot = readHealthSnapshot()

  return {
    status: 'ok',
    timestamp: snapshot.checkedAt.toISOString(),
  }
}
