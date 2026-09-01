import { deepMergeJson, mergeJsonFiles } from './json.js'
import type { MergeStrategy } from './types.js'

/**
 * JSON Merge 策略：深度合并 JSON 配置文件（tsconfig.json 等）。
 * package.json 由 package.ts generator 单独处理，不经过这里。
 */
export class JsonMergeStrategy implements MergeStrategy {
  canHandle(file: string): boolean {
    return file.endsWith('.json') && !file.endsWith('package.json')
  }

  async merge(source: string, target: string): Promise<void> {
    await mergeJsonFiles(source, target)
  }
}

export { deepMergeJson }
