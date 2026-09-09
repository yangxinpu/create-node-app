import { readHealthSnapshot } from '../repositories/health.repository.{{extension}}'
import type { HealthStatus } from '../schemas/health.{{extension}}'

export function getHealthStatus(): HealthStatus {
  const snapshot = readHealthSnapshot()

  return {
    status: 'ok',
    timestamp: snapshot.checkedAt.toISOString(),
  }
}
