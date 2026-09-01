import { mergeEnvFiles } from './env.js'
import type { MergeStrategy } from './types.js'

/**
 * Environment Merge 策略：合并 .env 文件，追加不重复的变量行。
 */
export class EnvMergeStrategy implements MergeStrategy {
  canHandle(file: string): boolean {
    return file.endsWith('.env') || file.endsWith('.env.example') || file === '.env'
  }

  async merge(source: string, target: string): Promise<void> {
    await mergeEnvFiles(source, target)
  }
}
