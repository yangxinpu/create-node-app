import { getHealthStatus as getHealthStatusFromService } from '../services/health.service.{{extension}}'
import type { HealthStatus } from '../schemas/health.{{extension}}'

export function getHealthStatus(): HealthStatus {
  return getHealthStatusFromService()
}
