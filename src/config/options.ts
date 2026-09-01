/**
 * 所有可选值的唯一来源。
 * CLI 参数、Prompts、Schema 校验都从这里读取。
 */

export const RUNTIMES = ['node', 'bun'] as const
export const LANGUAGES = ['typescript', 'javascript'] as const
export const FRAMEWORKS = ['elysia', 'hono', 'express', 'fastify', 'none'] as const
export const DATABASES = ['mysql', 'postgresql', 'sqlite', 'mongodb', 'none'] as const
export const ORMS = ['prisma', 'drizzle', 'none'] as const
export const CACHES = ['redis', 'none'] as const
export const TESTS = ['vitest', 'none'] as const
export const ARCHITECTURES = ['minimal', 'api', 'layered'] as const
export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const
export const PRESETS = ['minimal', 'api', 'fullstack', 'microservice'] as const

export type Runtime = (typeof RUNTIMES)[number]
export type Language = (typeof LANGUAGES)[number]
export type Framework = (typeof FRAMEWORKS)[number]
export type Database = (typeof DATABASES)[number]
export type Orm = (typeof ORMS)[number]
export type Cache = (typeof CACHES)[number]
export type Test = (typeof TESTS)[number]
export type Architecture = (typeof ARCHITECTURES)[number]
export type PackageManagerName = (typeof PACKAGE_MANAGERS)[number]
export type PresetName = (typeof PRESETS)[number]
