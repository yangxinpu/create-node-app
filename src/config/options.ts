/**
 * 所有可选值的唯一来源。
 * CLI 参数、Prompts、Schema 校验都从这里读取。
 */

export const RUNTIMES = ['node', 'bun'] as const
export const NODE_LTS_VERSIONS = ['24', '22'] as const
export const BUN_STABLE_VERSIONS = ['1.4', '1.3'] as const
export const LANGUAGES = ['typescript', 'javascript'] as const
export const FRAMEWORKS = ['express', 'elysia', 'hono', 'fastify', 'none'] as const
export const DATABASES = ['mysql', 'postgresql', 'mongodb', 'none'] as const
export const ORMS = ['prisma', 'drizzle', 'none'] as const
export const CACHES = ['redis', 'none'] as const
export const ARCHITECTURES = ['minimal', 'api', 'layered'] as const
export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const
export const PRESETS = ['minimal', 'api', 'fullstack', 'microservice'] as const

export type Runtime = (typeof RUNTIMES)[number]
export type NodeLtsVersion = (typeof NODE_LTS_VERSIONS)[number]
export type BunStableVersion = (typeof BUN_STABLE_VERSIONS)[number]
export type RuntimeVersion = NodeLtsVersion | BunStableVersion
export type Language = (typeof LANGUAGES)[number]
export type Framework = (typeof FRAMEWORKS)[number]
export type Database = (typeof DATABASES)[number]
export type Orm = (typeof ORMS)[number]
export type Cache = (typeof CACHES)[number]
export type Architecture = (typeof ARCHITECTURES)[number]
export type PackageManagerName = (typeof PACKAGE_MANAGERS)[number]
export type PresetName = (typeof PRESETS)[number]

/** 返回指定运行时支持的版本列表。 */
export function getRuntimeVersions(runtime: Runtime): readonly RuntimeVersion[] {
  return runtime === 'node' ? NODE_LTS_VERSIONS : BUN_STABLE_VERSIONS
}

/** 返回指定运行时的推荐版本。 */
export function getDefaultRuntimeVersion(runtime: Runtime): RuntimeVersion {
  return getRuntimeVersions(runtime)[0] as RuntimeVersion
}
