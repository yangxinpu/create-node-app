import { readFile, writeFile } from 'node:fs/promises'

/**
 * JSON Merge：深度合并 JSON 文件（用于 package.json / tsconfig.json 等）。
 * 对象递归合并，数组与标量由来源覆盖目标。
 */
export function deepMergeJson(target: unknown, source: unknown): unknown {
  if (
    isPlainObject(target) &&
    isPlainObject(source)
  ) {
    const result: Record<string, unknown> = { ...target }
    for (const [key, value] of Object.entries(source)) {
      if (key in result) {
        result[key] = deepMergeJson(result[key], value)
      } else {
        result[key] = value
      }
    }
    return result
  }
  return source
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function mergeJsonFiles(sourcePath: string, targetPath: string): Promise<void> {
  const [sourceContent, targetContent] = await Promise.all([
    readFile(sourcePath, 'utf-8'),
    readFile(targetPath, 'utf-8'),
  ])
  const merged = deepMergeJson(JSON.parse(targetContent), JSON.parse(sourceContent))
  await writeFile(targetPath, `${JSON.stringify(merged, null, 2)}\n`)
}
