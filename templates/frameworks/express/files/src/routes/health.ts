import { Router } from 'express'

import { getHealthStatus } from '../health.js'

export const health = Router().get('/health', (_req, res) => {
  res.json(getHealthStatus())
})
