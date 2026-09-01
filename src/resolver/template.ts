import type { ProjectContext } from '../context/types.js'

/**
 * 根据 ProjectContext 决定需要加载哪些模板模块。
 * 返回相对于 templates/ 的模块路径列表。
 */
export function resolveTemplates(ctx: ProjectContext): string[] {
  const t: string[] = []
  t.push(`base/${ctx.language}`)
  t.push(`runtimes/${ctx.runtime}`)
  if (ctx.framework !== 'none') t.push(`frameworks/${ctx.framework}`)
  if (ctx.database !== 'none') t.push(`databases/${ctx.database}`)
  if (ctx.orm !== 'none') t.push(`orm/${ctx.orm}`)
  if (ctx.cache !== 'none') t.push(`cache/${ctx.cache}`)
  if (ctx.test !== 'none') t.push(`testing/${ctx.test}`)
  if (ctx.eslint) t.push('tooling/eslint')
  if (ctx.prettier) t.push('tooling/prettier')
  if (ctx.docker) t.push('tooling/docker')
  t.push(`architecture/${ctx.architecture}`)
  return t
}
