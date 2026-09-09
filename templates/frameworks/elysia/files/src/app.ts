import { Elysia } from 'elysia'
{{#if runtime=node}}
import { node } from '@elysiajs/node'
{{/if}}

import { homePage } from './home.js'
import { health } from './routes/health.js'

{{#if runtime=node}}
export const app = new Elysia({ adapter: node() })
  .get('/', () => new Response(homePage, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  }))
  .use(health)
{{/if}}
{{#if runtime=bun}}
export const app = new Elysia()
  .get('/', () => new Response(homePage, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  }))
  .use(health)
{{/if}}
