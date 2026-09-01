import type { FastifyInstance } from 'fastify'

export async function health(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
}
