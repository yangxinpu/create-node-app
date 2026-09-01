import path from 'node:path'
import { appendFile } from 'node:fs/promises'
import { pathExists } from 'fs-extra'

import type { ProjectContext } from '../context/types.js'
import type { ResolvedDependencies } from '../resolver/dependency.js'

/**
 * 根据各模板声明的环境变量生成 .env.example。
 * 如果模板文件已通过 Merge System 生成 .env.example，则追加不重复的变量；
 * 否则创建新文件。没有环境变量时跳过。
 */
export async function generateEnv(
  context: ProjectContext,
  deps: ResolvedDependencies,
): Promise<void> {
  const entries = Object.entries(deps.env)
  if (entries.length === 0) return

  const envPath = path.join(context.projectPath, '.env.example')
  const content = entries.map(([key, value]) => `${key}=${value}`).join('\n') + '\n'

  if (await pathExists(envPath)) {
    // 读取已有内容，过滤掉已存在的变量
    const { readFile } = await import('node:fs/promises')
    const existing = await readFile(envPath, 'utf-8')
    const existingKeys = new Set(
      existing
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))
        .map((l) => l.split('=')[0]),
    )
    const newEntries = entries.filter(([key]) => !existingKeys.has(key))
    if (newEntries.length > 0) {
      const newContent = newEntries.map(([key, value]) => `${key}=${value}`).join('\n') + '\n'
      await appendFile(envPath, `\n${newContent}`)
    }
  } else {
    const { writeFile } = await import('node:fs/promises')
    await writeFile(envPath, content)
  }
}
