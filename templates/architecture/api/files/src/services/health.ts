import type { HealthStatus } from '../schemas/health.js'

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
}
