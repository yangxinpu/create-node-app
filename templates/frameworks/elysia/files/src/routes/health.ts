import { Elysia } from 'elysia'

import { getHealthStatus } from '../health.{{extension}}'

export const health = new Elysia().get('/health', getHealthStatus)
