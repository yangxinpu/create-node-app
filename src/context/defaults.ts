import type { ProjectContext } from './types.js'

export type ContextDefaults = Omit<ProjectContext, 'projectName' | 'projectPath'>

/**
 * `--yes` 等价配置：
 * node + typescript + elysia + none + none + none + eslint + prettier
 */
export const DEFAULT_CONTEXT: ContextDefaults = {
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
  packageManager: 'npm',
  noInstall: false,
  noGit: false,
}
