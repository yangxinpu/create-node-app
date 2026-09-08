import path from 'node:path'
import { pathExists } from 'fs-extra'
import { execa } from 'execa'

import type { ContextDefaults } from '../context/defaults.js'
import type { RawContext } from '../context/normalize.js'
import type { PresetName } from '../config/options.js'
import { getPreset } from '../presets/index.js'
import { logger } from '../utils/logger.js'

/**
 * 加载 node-app.config.ts / .js 配置文件。
 * 使用 tsx 动态导入 TS 配置，失败时回退到直接 import。
 */
export async function loadConfigFile(
  configPath: string,
): Promise<Partial<ContextDefaults> | null> {
  const absPath = path.resolve(configPath)
  if (!(await pathExists(absPath))) {
    logger.warn(`Config file not found: ${configPath}`)
    return null
  }

  try {
    // TS 配置文件需要通过 tsx 运行时编译
    if (absPath.endsWith('.ts')) {
      const { stdout } = await execa('npx', ['tsx', '--eval', `import('${absPath}').then(m => console.log(JSON.stringify(m.default || {})))`], {
        cwd: path.dirname(absPath),
      })
      return JSON.parse(stdout) as Partial<ContextDefaults>
    }

    // JS 配置文件直接动态导入
    const fileUrl = `file://${absPath}`
    const mod = await import(fileUrl)
    return (mod.default ?? mod) as Partial<ContextDefaults>
  } catch (error) {
    logger.warn(
      `Failed to load config file: ${error instanceof Error ? error.message : String(error)}`,
    )
    return null
  }
}

/**
 * 根据 preset 名称和 config 文件路径解析配置。
 * preset 和 config 的字段会被后续 normalize 中的用户输入覆盖。
 */
export function resolvePreset(
  presetName: string | undefined,
): Partial<ContextDefaults> | null {
  if (!presetName) return null
  const preset = getPreset(presetName)
  if (!preset) {
    logger.warn(`Unknown preset: ${presetName}`)
    return null
  }
  return preset
}

export type { PresetName, RawContext }
