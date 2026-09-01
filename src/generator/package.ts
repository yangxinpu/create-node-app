import path from 'node:path'
import { writeFile } from 'node:fs/promises'

import type { ProjectContext } from '../context/types.js'
import type { ResolvedDependencies } from '../resolver/dependency.js'
import { isTsOnlyPackage } from './language.js'

/**
 * 根据 ProjectContext + 合并后的依赖生成最终 package.json。
 * JavaScript 模式下会过滤掉 TS 工具链依赖（typescript / tsx / @types/* 等）。
 */
export async function generatePackageJson(
  context: ProjectContext,
  deps: ResolvedDependencies,
): Promise<void> {
  const isJs = context.language === 'javascript'

  const dependencies = isJs
    ? filterRecord(deps.dependencies, (name) => !isTsOnlyPackage(name))
    : deps.dependencies
  const devDependencies = isJs
    ? filterRecord(deps.devDependencies, (name) => !isTsOnlyPackage(name))
    : deps.devDependencies

  const pkg: Record<string, unknown> = {
    name: context.projectName,
    version: '0.1.0',
    type: 'module',
    private: true,
    scripts: deps.scripts,
  }

  if (Object.keys(dependencies).length > 0) {
    pkg.dependencies = sortRecord(dependencies)
  }
  if (Object.keys(devDependencies).length > 0) {
    pkg.devDependencies = sortRecord(devDependencies)
  }

  const target = path.join(context.projectPath, 'package.json')
  await writeFile(target, `${JSON.stringify(pkg, null, 2)}\n`)
}

function filterRecord(
  record: Record<string, string>,
  predicate: (name: string) => boolean,
): Record<string, string> {
  return Object.fromEntries(Object.entries(record).filter(([name]) => predicate(name)))
}

function sortRecord(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)))
}
