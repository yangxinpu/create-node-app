/**
 * 模板模块的元数据描述（对应 template.json）。
 */
export interface TemplateMeta {
  name: string
  type:
    | 'base'
    | 'runtime'
    | 'framework'
    | 'database'
    | 'orm'
    | 'cache'
    | 'testing'
    | 'tooling'
    | 'architecture'
  version?: string
  description?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  scripts?: Record<string, string>
  env?: Record<string, string>
  compatibility?: {
    runtime?: string[]
    language?: string[]
    framework?: string[]
    database?: string[]
    orm?: string[]
  }
}

export interface ResolvedDependencies {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  scripts: Record<string, string>
  env: Record<string, string>
}

/**
 * 合并多个模板模块声明的依赖、脚本、环境变量。
 * 后加载的模块覆盖先加载的同名条目。
 */
export function resolveDependencies(metas: TemplateMeta[]): ResolvedDependencies {
  const result: ResolvedDependencies = {
    dependencies: {},
    devDependencies: {},
    scripts: {},
    env: {},
  }
  for (const meta of metas) {
    Object.assign(result.dependencies, meta.dependencies)
    Object.assign(result.devDependencies, meta.devDependencies)
    Object.assign(result.scripts, meta.scripts)
    Object.assign(result.env, meta.env)
  }
  return result
}
