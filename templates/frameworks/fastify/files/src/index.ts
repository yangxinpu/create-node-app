import Fastify from 'fastify'

import { homePage } from './home.js'
import { health } from './routes/health.js'

export const app = Fastify({ logger: false })

app.get('/', async (_request, reply) => {
  return reply.type('text/html; charset=utf-8').send(homePage)
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
