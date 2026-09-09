import { readFileSync } from 'node:fs'

import Fastify from 'fastify'

import {
  fastifyRequestLoggerEnd,
  fastifyRequestLoggerStart,
} from './middleware/logger.{{extension}}'
import { health } from './routes/health.{{extension}}'

export const app = Fastify({ logger: false })
const homePage = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8')

app.addHook('onRequest', async (request) => fastifyRequestLoggerStart(request))
app.addHook('onResponse', async (request, reply) => fastifyRequestLoggerEnd(request, reply))

app.get('/', async (_request, reply) => {
  return reply.type('text/html; charset=utf-8').send(homePage)
})
app.get('/api/greetings', async () => {
  return { data: { message: 'Hello Node App' } }
})
app.register(health)

const port = Number(process.env.PORT ?? 3000)

app
  .listen({ port, host: '0.0.0.0' })
  .then((address) => {
    console.log(`Fastify is running at ${address}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
