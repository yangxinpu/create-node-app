import { Elysia } from 'elysia'

import { getHealthStatus } from '../health.js'

export const health = new Elysia().get('/health', getHealthStatus)
