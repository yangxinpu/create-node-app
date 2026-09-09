import { Hono } from 'hono'

import { getHealthStatus } from '../health.{{extension}}'

export const health = new Hono().get('/health', (c) => c.json(getHealthStatus()))
