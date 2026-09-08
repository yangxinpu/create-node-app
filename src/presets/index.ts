import type { ContextDefaults } from '../context/defaults.js'
import type { PresetName } from '../config/options.js'

/**
 * Preset 是 ProjectContext 的预设快照，不是独立的生成逻辑。
 * 数据流：Preset → Normalize → ProjectContext → 统一 Generator。
 */
export const PRESETS: Record<PresetName, Partial<ContextDefaults>> = {
  minimal: {
    runtime: 'node',
    language: 'typescript',
    framework: 'elysia',
    database: 'none',
    orm: 'none',
    cache: 'none',
    architecture: 'minimal',
    eslint: true,
    prettier: true,
    docker: false,
  },
  api: {
    runtime: 'node',
    language: 'typescript',
    framework: 'elysia',
    database: 'mysql',
    orm: 'prisma',
    cache: 'redis',
    architecture: 'api',
    eslint: true,
    prettier: true,
    docker: true,
  },
  fullstack: {
    runtime: 'node',
    language: 'typescript',
    framework: 'elysia',
    database: 'postgresql',
    orm: 'prisma',
    cache: 'redis',
    architecture: 'layered',
    eslint: true,
    prettier: true,
    docker: true,
  },
  microservice: {
    runtime: 'node',
    language: 'typescript',
    framework: 'fastify',
    database: 'postgresql',
    orm: 'drizzle',
    cache: 'redis',
    architecture: 'layered',
    eslint: true,
    prettier: true,
    docker: true,
  },
}

/**
 * 根据 preset 名称获取预设配置。不存在时返回 null。
 */
export function getPreset(name: string): Partial<ContextDefaults> | null {
  return PRESETS[name as PresetName] ?? null
}
