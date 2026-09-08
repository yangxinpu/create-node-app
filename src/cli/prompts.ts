import { confirm, input, select } from '@inquirer/prompts'

import {
  ARCHITECTURES,
  CACHES,
  DATABASES,
  FRAMEWORKS,
  LANGUAGES,
  ORMS,
  RUNTIMES,
} from '../config/options.js'
import type { ProjectContext } from '../context/types.js'
import type { RawContext } from '../context/normalize.js'
import type { CreateCommandOptions } from './commands/create.js'

type Choice<T extends string> = { name: string; value: T }

function toChoices<T extends string>(values: readonly T[]): Choice<T>[] {
  return values.map((value) => ({ name: value, value }))
}

/**
 * 交互式询问缺失的字段。已通过 CLI 参数提供的字段直接跳过。
 */
export async function runPrompts(
  projectName: string | undefined,
  options: CreateCommandOptions,
): Promise<RawContext> {
  const name =
    projectName ??
    (await input({ message: 'Project name:', default: 'my-app' }))

  const runtime =
    (options.runtime as ProjectContext['runtime']) ??
    (await select({ message: 'Select runtime:', choices: toChoices(RUNTIMES) }))

  const language =
    (options.language as ProjectContext['language']) ??
    (await select({ message: 'Select language:', choices: toChoices(LANGUAGES) }))

  const framework =
    (options.framework as ProjectContext['framework']) ??
    (await select({ message: 'Select framework:', choices: toChoices(FRAMEWORKS) }))

  const database =
    (options.database as ProjectContext['database']) ??
    (await select({ message: 'Select database:', choices: toChoices(DATABASES) }))

  const orm =
    (options.orm as ProjectContext['orm']) ??
    (await select({ message: 'Select ORM:', choices: toChoices(ORMS) }))

  const cache =
    (options.cache as ProjectContext['cache']) ??
    (await select({ message: 'Select cache:', choices: toChoices(CACHES) }))

  const architecture =
    (options.architecture as ProjectContext['architecture']) ??
    (await select({ message: 'Select architecture:', choices: toChoices(ARCHITECTURES) }))

  const eslint = options.eslint ?? (await confirm({ message: 'Use ESLint?', default: true }))
  const prettier =
    options.prettier ?? (await confirm({ message: 'Use Prettier?', default: true }))
  const docker = options.docker ?? (await confirm({ message: 'Use Docker?', default: false }))

  return {
    projectName: name,
    runtime,
    language,
    framework,
    database,
    orm,
    cache,
    architecture,
    eslint,
    prettier,
    docker,
    packageManager: options.packageManager as ProjectContext['packageManager'],
    noInstall: options.install === false,
    noGit: options.git === false,
  }
}
