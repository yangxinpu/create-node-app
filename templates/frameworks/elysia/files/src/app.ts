import { Elysia } from 'elysia'
{{#if runtime=node}}
import { node } from '@elysiajs/node'
{{/if}}

import { health } from './routes/health.js'

{{#if runtime=node}}
export const app = new Elysia({ adapter: node() }).use(health)
{{/if}}
{{#if runtime=bun}}
export const app = new Elysia().use(health)
{{/if}}
