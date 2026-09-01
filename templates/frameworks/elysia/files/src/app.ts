import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

import { health } from './routes/health.js'

export const app = new Elysia({ adapter: node() }).use(health)
