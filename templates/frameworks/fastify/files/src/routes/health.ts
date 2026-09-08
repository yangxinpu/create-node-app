import type { FastifyInstance } from 'fastify'

import { getHealthStatus } from '../health.js'

export async function health(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => getHealthStatus())
}
