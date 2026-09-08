import { getHealthStatus as getHealthStatusFromService } from '../services/health.service.js'
import type { HealthStatus } from '../schemas/health.js'

export function getHealthStatus(): HealthStatus {
  return getHealthStatusFromService()
}
