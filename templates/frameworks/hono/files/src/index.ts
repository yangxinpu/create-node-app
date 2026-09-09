import { readFileSync } from 'node:fs'

import { Hono } from 'hono'
{{#if runtime=node}}
import { serve } from '@hono/node-server'
{{/if}}

import { honoRequestLogger } from './middleware/logger.{{extension}}'
import { health } from './routes/health.{{extension}}'

export const app = new Hono()
const homePage = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8')

app.use('*', (context, next) => honoRequestLogger(context, next))
app.get('/', (context) => context.html(homePage))
app.get('/api/greetings', (context) => context.json({ data: { message: 'Hello Node App' } }))
app.route('/', health)

const port = Number(process.env.PORT ?? 3000)

{{#if runtime=node}}
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Hono is running at http://localhost:${info.port}`)
})
{{/if}}
{{#if runtime=bun}}
export default {
  fetch: app.fetch,
  port,
}

console.log(`Hono is running at http://localhost:${port}`)
{{/if}}
