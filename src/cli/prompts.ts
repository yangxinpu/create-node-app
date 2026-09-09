import * as prompts from '@clack/prompts'
import pc from 'picocolors'

import {
  ARCHITECTURES,
  CACHES,
  DATABASES,
  FRAMEWORKS,
  getDefaultRuntimeVersion,
  getRuntimeVersions,
  LANGUAGES,
  ORMS,
  RUNTIMES,
} from '../config/options.js'
import { DEFAULT_CONTEXT } from '../context/defaults.js'
import type { RawContext } from '../context/normalize.js'
import type { ProjectContext } from '../context/types.js'
import { validateProjectName } from '../validation/schema.js'
import type { CreateCommandOptions } from './commands/create.js'

type Choice<T extends string> = {
  value: T
  label: string
  hint?: string
}

type Tooling = 'eslint' | 'prettier' | 'docker'
type Colorizer = (value: string) => string

/** CLI 选项的用户可读名称。 */
const LABELS: Record<string, string> = {
  node: 'Node.js',
  bun: 'Bun',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  elysia: 'Elysia',
  hono: 'Hono',
  express: 'Express',
  fastify: 'Fastify',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  prisma: 'Prisma',
  drizzle: 'Drizzle',
  redis: 'Redis',
  none: 'None',
  minimal: 'Minimal',
  api: 'API',
  layered: 'Layered',
  '24': 'Node.js 24',
  '22': 'Node.js 22',
  '1.4': 'Bun 1.4',
  '1.3': 'Bun 1.3',
}

/** 选中选项时显示的简短说明。 */
const HINTS: Partial<Record<string, string>> = {
  node: 'widest ecosystem support',
  bun: 'fast all-in-one runtime',
  elysia: 'type-safe and Bun-first',
  hono: 'small and standards-based',
  express: 'minimal and established',
  fastify: 'high-performance server',
  minimal: 'smallest project structure',
  api: 'routes, services and schemas',
  layered: 'controllers, services and repositories',
  '24': 'Active LTS, recommended',
  '22': 'Maintenance LTS',
  '1.4': 'current stable line, recommended',
  '1.3': 'previous stable line',
  none: 'skip this integration',
}

/** 各选项在 TUI 中使用的字体颜色。 */
const COLORS: Partial<Record<string, Colorizer>> = {
  node: pc.green,
  bun: pc.magenta,
  typescript: pc.blue,
  javascript: pc.yellow,
  express: pc.green,
  elysia: pc.magenta,
  hono: pc.cyan,
  fastify: pc.blue,
  mysql: pc.blue,
  postgresql: pc.cyan,
  mongodb: pc.green,
  prisma: pc.cyan,
  drizzle: pc.yellow,
  redis: pc.red,
  none: pc.dim,
  minimal: pc.green,
  api: pc.cyan,
  layered: pc.magenta,
  '24': pc.green,
  '22': pc.cyan,
  '1.4': pc.magenta,
  '1.3': pc.yellow,
}

/**
 * 交互式询问缺失字段。已通过 CLI 参数提供的字段会直接跳过。
 */
export async function runPrompts(
  projectName: string | undefined,
  options: CreateCommandOptions,
): Promise<RawContext> {
  const name =
    projectName ??
    unwrap(
      await prompts.text({
        message: 'Project name',
        placeholder: 'my-app',
        defaultValue: 'my-app',
        validate: validateName,
      }),
    )

  const runtime =
    (options.runtime as ProjectContext['runtime']) ??
    (await selectValue('Runtime', RUNTIMES, DEFAULT_CONTEXT.runtime))

  const runtimeVersion =
    (options.runtimeVersion as ProjectContext['runtimeVersion']) ??
    (await selectValue(
      runtime === 'node' ? 'Node.js LTS version' : 'Bun stable version',
      getRuntimeVersions(runtime),
      getDefaultRuntimeVersion(runtime),
    ))

  const language =
    (options.language as ProjectContext['language']) ??
    (await selectValue('Language', LANGUAGES, DEFAULT_CONTEXT.language))

  const framework =
    (options.framework as ProjectContext['framework']) ??
    (await selectValue('Framework', FRAMEWORKS, DEFAULT_CONTEXT.framework))

  const database =
    (options.database as ProjectContext['database']) ??
    (await selectValue('Database', DATABASES, DEFAULT_CONTEXT.database))

  const orm =
    (options.orm as ProjectContext['orm']) ??
    (database === 'none' ? 'none' : await selectValue('ORM', ORMS, DEFAULT_CONTEXT.orm))

  const cache =
    (options.cache as ProjectContext['cache']) ??
    (await selectValue('Cache', CACHES, DEFAULT_CONTEXT.cache))

  const architecture =
    (options.architecture as ProjectContext['architecture']) ??
    (await selectValue('Project structure', ARCHITECTURES, DEFAULT_CONTEXT.architecture))

  const tooling = await promptTooling(options)

  return {
    projectName: name.trim(),
    runtime,
    runtimeVersion,
    language,
    framework,
    database,
    orm,
    cache,
    architecture,
    ...tooling,
    packageManager: options.packageManager as ProjectContext['packageManager'],
    noInstall: options.install === false,
    noGit: options.git === false,
  }
}

/** 将配置值转换为用户可读的选项。 */
function toChoices<T extends string>(values: readonly T[]): Choice<T>[] {
  return values.map((value) => ({
    value,
    label: (COLORS[value] ?? pc.white)(LABELS[value] ?? value),
    hint: HINTS[value],
  }))
}

/** 渲染单选问题并统一处理取消操作。 */
async function selectValue<T extends string>(
  message: string,
  values: readonly T[],
  initialValue: T,
): Promise<T> {
  return unwrap(
    await prompts.select<T>({
      message,
      options: toChoices(values) as prompts.Option<T>[],
      initialValue,
    }),
  )
}

/** 将工程化开关合并为一个多选问题。 */
async function promptTooling(
  options: CreateCommandOptions,
): Promise<Pick<ProjectContext, 'eslint' | 'prettier' | 'docker'>> {
  const available: Choice<Tooling>[] = []
  if (options.eslint === undefined) {
    available.push({
      value: 'eslint',
      label: pc.blue('ESLint'),
      hint: 'code quality',
    })
  }
  if (options.prettier === undefined) {
    available.push({
      value: 'prettier',
      label: pc.magenta('Prettier'),
      hint: 'code formatting',
    })
  }
  if (options.docker === undefined) {
    available.push({
      value: 'docker',
      label: pc.cyan('Docker'),
      hint: 'container setup',
    })
  }

  const selected =
    available.length === 0
      ? []
      : unwrap(
          await prompts.multiselect<Tooling>({
            message: 'Tooling',
            options: available,
            initialValues: available
              .map((choice) => choice.value)
              .filter((value) => value === 'eslint' || value === 'prettier'),
            required: false,
          }),
        )

  return {
    eslint: options.eslint ?? selected.includes('eslint'),
    prettier: options.prettier ?? selected.includes('prettier'),
    docker: options.docker ?? selected.includes('docker'),
  }
}

/** 校验项目名称并返回适合终端显示的错误信息。 */
function validateName(value: string): string | undefined {
  try {
    validateProjectName(value.trim())
    return undefined
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
}

/** 统一结束 Ctrl+C / Esc 取消流程。 */
function unwrap<T>(value: T | symbol): T {
  if (prompts.isCancel(value)) {
    prompts.cancel('Operation cancelled')
    process.exit(0)
  }
  return value
}
