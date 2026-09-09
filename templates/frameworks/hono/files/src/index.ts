import { Hono } from 'hono'
{{#if runtime=node}}
import { serve } from '@hono/node-server'
{{/if}}

import { homePage } from './home.js'
import { health } from './routes/health.js'

export const app = new Hono()

app.get('/', (context) => context.html(homePage))
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
