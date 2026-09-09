import path from 'node:path'

import { getDefaultRuntimeVersion } from '../../config/options.js'
import type { ProjectContext } from '../../context/types.js'
import { DEFAULT_CONTEXT } from '../../context/defaults.js'
import { normalizeContext } from '../../context/normalize.js'
import { createProject } from '../../generator/generator.js'
import { loadConfigFile, resolvePreset } from '../../resolver/preset.js'
import { detectPackageManager } from '../../runtime/package-manager.js'
import { logger } from '../../utils/logger.js'
import { runPrompts } from '../prompts.js'

export interface CreateCommandOptions {
  runtime?: string
  runtimeVersion?: string
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
  logger.intro('create-node-app')

  try {
    const context = await resolveContext(projectName, options)
    await createProject(context)
  } catch (error) {
    logger.cancel(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

/** 将 CLI、Preset、Config 与交互结果汇总为统一 Context。 */
async function resolveContext(
  projectName: string | undefined,
  options: CreateCommandOptions,
): Promise<ProjectContext> {
  // 1. 加载 preset / config 作为基础配置
  const presetConfig = resolvePreset(options.preset)
  const configFile = options.config ? await loadConfigFile(options.config) : null
  const hasConfiguredPackageManager = Boolean(
    options.packageManager ?? configFile?.packageManager ?? presetConfig?.packageManager,
  )
  const detectedPackageManager = hasConfiguredPackageManager
    ? DEFAULT_CONTEXT.packageManager
    : await detectPackageManager()

  const baseConfig = {
    ...DEFAULT_CONTEXT,
    packageManager: detectedPackageManager,
    ...presetConfig,
    ...configFile,
  }

  // 2. CLI 参数覆盖 preset / config
  const cliOverrides = stripUndefined({
    runtime: options.runtime,
    runtimeVersion: options.runtimeVersion,
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
    !options.yes && !options.preset && !options.config && !hasFullOptions(cliOverrides)

  if (interactive) {
    const answers = await runPrompts(projectName, options)
    return normalizeContext(answers)
  }

  return normalizeContext({
    projectName: projectName ?? 'my-app',
    projectPath: projectName ? path.resolve(projectName) : undefined,
    runtime: mergedOptions.runtime as ProjectContext['runtime'],
    runtimeVersion: resolveRuntimeVersion(
      mergedOptions.runtime as ProjectContext['runtime'],
      options,
      configFile,
      presetConfig,
    ),
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

/** 按 CLI > Config > Preset 的优先级解析与运行时匹配的版本。 */
function resolveRuntimeVersion(
  runtime: ProjectContext['runtime'],
  options: CreateCommandOptions,
  configFile: Partial<ProjectContext> | null,
  presetConfig: Partial<ProjectContext> | null,
): ProjectContext['runtimeVersion'] {
  if (options.runtimeVersion) {
    return options.runtimeVersion as ProjectContext['runtimeVersion']
  }
  if (options.runtime) {
    return getDefaultRuntimeVersion(runtime)
  }
  if (configFile?.runtimeVersion) {
    return configFile.runtimeVersion
  }
  if (configFile?.runtime) {
    return getDefaultRuntimeVersion(runtime)
  }
  if (presetConfig?.runtimeVersion) {
    return presetConfig.runtimeVersion
  }
  return getDefaultRuntimeVersion(runtime)
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
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>
}
