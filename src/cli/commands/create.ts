import path from 'node:path'

import type { ProjectContext } from '../../context/types.js'
import { DEFAULT_CONTEXT } from '../../context/defaults.js'
import { normalizeContext } from '../../context/normalize.js'
import { createProject } from '../../generator/generator.js'
import { loadConfigFile, resolvePreset } from '../../resolver/preset.js'
import { logger } from '../../utils/logger.js'
import { runPrompts } from '../prompts.js'

export interface CreateCommandOptions {
  runtime?: string
  language?: string
  framework?: string
  database?: string
  orm?: string
  cache?: string
  architecture?: string
  preset?: string
  config?: string
  eslint?: boolean
  prettier?: boolean
  docker?: boolean
  packageManager?: string
  // commander 将 --no-install / --no-git 映射为 install/git = false
  install?: boolean
  git?: boolean
  yes?: boolean
}

/**
 * create 命令：
 * - 提供了完整参数或 --yes 时走非交互模式
 * --preset / --config 提供基础配置，被 CLI 参数覆盖
 * - 否则进入交互式 Prompts
 */
export async function createCommand(
  projectName: string | undefined,
  options: CreateCommandOptions,
): Promise<void> {
  // 1. 加载 preset / config 作为基础配置
  const presetConfig = resolvePreset(options.preset)
  const configFile = options.config
    ? await loadConfigFile(options.config)
    : null

  const baseConfig = {
    ...DEFAULT_CONTEXT,
    ...presetConfig,
    ...configFile,
  }

  // 2. CLI 参数覆盖 preset / config
  const cliOverrides = stripUndefined({
    runtime: options.runtime,
    language: options.language,
    framework: options.framework,
    database: options.database,
    orm: options.orm,
    cache: options.cache,
    architecture: options.architecture,
    eslint: options.eslint,
    prettier: options.prettier,
    docker: options.docker,
    packageManager: options.packageManager,
  })

  const mergedOptions = { ...baseConfig, ...cliOverrides }

  // 3. 决定是否交互
  // 注意：必须检查「用户显式传入的 CLI 参数」是否完整，
  // 不能检查 mergedOptions —— 它已合并 DEFAULT_CONTEXT，字段永远完整。
  const interactive =
    !options.yes &&
    !options.preset &&
    !options.config &&
    !hasFullOptions(cliOverrides)

  let context: ProjectContext
  if (interactive) {
    const answers = await runPrompts(projectName, options)
    context = normalizeContext(answers)
  } else {
    context = normalizeContext({
      projectName: projectName ?? 'my-app',
      projectPath: projectName ? path.resolve(projectName) : undefined,
      runtime: mergedOptions.runtime as ProjectContext['runtime'],
      language: mergedOptions.language as ProjectContext['language'],
      framework: mergedOptions.framework as ProjectContext['framework'],
      database: mergedOptions.database as ProjectContext['database'],
      orm: mergedOptions.orm as ProjectContext['orm'],
      cache: mergedOptions.cache as ProjectContext['cache'],
      architecture: mergedOptions.architecture as ProjectContext['architecture'],
      eslint: mergedOptions.eslint,
      prettier: mergedOptions.prettier,
      docker: mergedOptions.docker,
      packageManager: mergedOptions.packageManager as ProjectContext['packageManager'],
      noInstall: options.install === false,
      noGit: options.git === false,
    })
  }

  try {
    await createProject(context)
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

function hasFullOptions(opts: Record<string, unknown>): boolean {
  return Boolean(
    opts.runtime &&
      opts.language &&
      opts.framework &&
      opts.database &&
      opts.orm &&
      opts.cache &&
      opts.architecture,
  )
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>
}
