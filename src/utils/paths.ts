import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * templates/ 目录的绝对路径。
 * 开发时从 src/utils 向上两级，打包后从 dist 向上一级，取先存在者。
 */
export function getTemplatesRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(here, '../..'), // src/utils -> 项目根（开发）
    path.resolve(here, '..'), // dist -> 项目根（打包后）
  ]
  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, 'templates'))) {
      return path.join(candidate, 'templates')
    }
  }
  return path.join(candidates[0]!, 'templates')
}
