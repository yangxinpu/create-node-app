import path from 'node:path'

import type { MergeStrategy } from './types.js'
import { JsonMergeStrategy } from './json-strategy.js'
import { EnvMergeStrategy } from './env-strategy.js'

/**
 * 文件合并策略注册表。
 * 按文件类型分发：package.json / tsconfig.json → JSON Deep Merge，.env → Environment Merge。
 * 未匹配的文件走默认 Copy 策略（由调用方直接覆盖）。
 */
const strategies: MergeStrategy[] = [
  new JsonMergeStrategy(),
  new EnvMergeStrategy(),
]

/**
 * 判断指定文件是否需要合并（而非直接覆盖）。
 */
export function shouldMerge(filePath: string): boolean {
  return strategies.some((s) => s.canHandle(filePath))
}

/**
 * 按策略合并文件。如果目标文件不存在则返回 false（调用方应直接写入）。
 */
export async function mergeFile(
  sourcePath: string,
  targetPath: string,
): Promise<boolean> {
  const strategy = strategies.find((s) => s.canHandle(targetPath))
  if (!strategy) return false

  const { pathExists } = await import('fs-extra')
  if (!(await pathExists(targetPath))) return false

  await strategy.merge(sourcePath, targetPath)
  return true
}

export { JsonMergeStrategy, EnvMergeStrategy }
export const mergeStrategies = strategies

/**
 * 工具函数：从完整路径提取文件名。
 */
export function basename(filePath: string): string {
  return path.basename(filePath)
}
