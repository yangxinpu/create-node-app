import {
  ARCHITECTURES,
  CACHES,
  DATABASES,
  FRAMEWORKS,
  LANGUAGES,
  ORMS,
  PACKAGE_MANAGERS,
  RUNTIMES,
  getRuntimeVersions,
} from '../config/options.js'
import type { ProjectContext } from '../context/types.js'

export class ValidationError extends Error {}

export const PROJECT_NAME_RE = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/

export function validateProjectName(name: string): void {
  if (!PROJECT_NAME_RE.test(name)) {
    throw new ValidationError(
      `Invalid project name "${name}". Use lowercase letters, numbers, ".", "-" or "_".`,
    )
  }
}

export function assertOneOf<T extends string>(
  field: string,
  value: string,
  allowed: readonly T[],
): asserts value is T {
  if (!allowed.includes(value as T)) {
    throw new ValidationError(
      `Invalid ${field} "${value}". Expected one of: ${allowed.join(', ')}`,
    )
  }
}

/**
 * Schema 校验：保证下游 Generator 拿到的一定是合法 Context。
 */
export function validateContext(context: ProjectContext): void {
  validateProjectName(context.projectName)
  if (!context.projectPath) {
    throw new ValidationError('projectPath is required')
  }
  assertOneOf('runtime', context.runtime, RUNTIMES)
  assertOneOf(
    `${context.runtime} version`,
    context.runtimeVersion,
    getRuntimeVersions(context.runtime),
  )
  assertOneOf('language', context.language, LANGUAGES)
  assertOneOf('framework', context.framework, FRAMEWORKS)
  assertOneOf('database', context.database, DATABASES)
  assertOneOf('orm', context.orm, ORMS)
  assertOneOf('cache', context.cache, CACHES)
  assertOneOf('architecture', context.architecture, ARCHITECTURES)
  assertOneOf('package-manager', context.packageManager, PACKAGE_MANAGERS)
}
