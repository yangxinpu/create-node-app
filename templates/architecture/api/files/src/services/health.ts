import type { HealthStatus } from '../schemas/health.{{extension}}'

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
}
