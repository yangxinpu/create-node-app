/**
 * 文件合并策略接口。按文件类型分发，而非一刀切的 Copy。
 */
export interface MergeStrategy {
  canHandle(file: string): boolean
  merge(source: string, target: string): Promise<void>
}
