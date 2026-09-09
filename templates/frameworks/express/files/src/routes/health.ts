import { Router } from 'express'

import { getHealthStatus } from '../health.{{extension}}'

export const health = Router().get('/health', (_req, res) => {
  res.json(getHealthStatus())
})
