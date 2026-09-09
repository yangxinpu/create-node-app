import { getDefaultRuntimeVersion } from '../config/options.js'
import { DEFAULT_CONTEXT } from './defaults.js'
import type { ProjectContext } from './types.js'

export type RawContext = Partial<ProjectContext> & { projectName: string }

/**
 * 把任意来源（CLI / Prompt / Preset / Config）的部分输入
 * 补全为完整 ProjectContext。未提供的字段使用默认值。
 */
export function normalizeContext(raw: RawContext): ProjectContext {
  // 过滤 undefined，避免覆盖默认值
  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(([, value]) => value !== undefined),
  ) as RawContext
  const runtime = cleaned.runtime ?? DEFAULT_CONTEXT.runtime
  const runtimeVersion =
    cleaned.runtimeVersion ?? getDefaultRuntimeVersion(runtime)

  return {
    ...DEFAULT_CONTEXT,
    ...cleaned,
    runtime,
    runtimeVersion,
    projectName: raw.projectName,
    projectPath: raw.projectPath ?? raw.projectName,
  }
}
