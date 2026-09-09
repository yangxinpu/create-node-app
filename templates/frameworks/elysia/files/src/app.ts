import { readFileSync } from 'node:fs'

import { Elysia } from 'elysia'
{{#if runtime=node}}
import { node } from '@elysiajs/node'
{{/if}}

import {
  elysiaRequestLoggerEnd,
  elysiaRequestLoggerStart,
} from './middleware/logger.{{extension}}'
import { health } from './routes/health.{{extension}}'

const homePage = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8')

{{#if runtime=node}}
export const app = new Elysia({ adapter: node() })
  .onRequest((context) => elysiaRequestLoggerStart(context))
  .onAfterResponse((context) => elysiaRequestLoggerEnd(context))
  .get('/', () => new Response(homePage, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  }))
  .get('/api/greetings', () => ({ data: { message: 'Hello Node App' } }))
  .use(health)
{{/if}}
{{#if runtime=bun}}
export const app = new Elysia()
  .onRequest((context) => elysiaRequestLoggerStart(context))
  .onAfterResponse((context) => elysiaRequestLoggerEnd(context))
  .get('/', () => new Response(homePage, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  }))
  .get('/api/greetings', () => ({ data: { message: 'Hello Node App' } }))
  .use(health)
{{/if}}
