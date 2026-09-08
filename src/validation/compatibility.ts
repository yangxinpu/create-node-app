import type { ProjectContext } from '../context/types.js'

export interface CompatibilityRule {
  name: string
  condition: (context: ProjectContext) => boolean
  level: 'error' | 'warning'
  message: string
}

export interface CompatibilityIssue {
  name: string
  level: 'error' | 'warning'
  message: string
}

/**
 * 兼容性规则注册表（数据驱动，可扩展）。
 * 规则独立于 Template，Template 之间不互相依赖。
 */
export const compatibilityRules: CompatibilityRule[] = [
  {
    name: 'elysia-runtime',
    condition: (ctx) => ctx.framework === 'elysia' && ctx.runtime === 'node',
    level: 'warning',
    message:
      'Elysia is optimized for Bun. On Node.js it runs via @elysiajs/node adapter.',
  },
  {
    name: 'orm-requires-database',
    condition: (ctx) => ctx.orm !== 'none' && ctx.database === 'none',
    level: 'error',
    message: 'An ORM requires a database. Select a database or set ORM to none.',
  },
  {
    name: 'drizzle-mongodb',
    condition: (ctx) => ctx.orm === 'drizzle' && ctx.database === 'mongodb',
    level: 'error',
    message: 'Drizzle ORM does not support MongoDB. Use Prisma instead.',
  },
  {
    name: 'express-bun',
    condition: (ctx) => ctx.framework === 'express' && ctx.runtime === 'bun',
    level: 'warning',
    message: 'Express on Bun works but may have limited native API support.',
  },
  {
    name: 'fastify-bun',
    condition: (ctx) => ctx.framework === 'fastify' && ctx.runtime === 'bun',
    level: 'warning',
    message: 'Fastify on Bun works but is optimized for Node.js.',
  },
]

/**
 * 运行所有兼容性规则，返回问题列表。
 * 有 error 级别问题时调用方应终止流程。
 */
export function checkCompatibility(context: ProjectContext): CompatibilityIssue[] {
  return compatibilityRules
    .filter((rule) => rule.condition(context))
    .map((rule) => ({ name: rule.name, level: rule.level, message: rule.message }))
}

export class CompatibilityError extends Error {}

export function validateCompatibility(context: ProjectContext): void {
  const issues = checkCompatibility(context)
  const errors = issues.filter((i) => i.level === 'error')
  if (errors.length > 0) {
    throw new CompatibilityError(errors.map((e) => e.message).join('\n'))
  }
}
