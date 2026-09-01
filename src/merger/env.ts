import { readFile, writeFile } from 'node:fs/promises'

/**
 * Environment Merge：合并 .env 文件，追加不重复的环境变量行。
 */
export async function mergeEnvFiles(sourcePath: string, targetPath: string): Promise<void> {
  const [sourceContent, targetContent] = await Promise.all([
    readFile(sourcePath, 'utf-8'),
    readFile(targetPath, 'utf-8').catch(() => ''),
  ])

  const targetKeys = new Set(
    targetContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split('=')[0]),
  )

  const newLines = sourceContent
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return true
      const key = trimmed.split('=')[0]
      return !targetKeys.has(key)
    })

  const merged = targetContent.trimEnd() + '\n' + newLines.join('\n')
  await writeFile(targetPath, merged.trimEnd() + '\n')
}
