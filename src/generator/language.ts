import { transformSync } from 'esbuild'

import type { ProjectContext } from '../context/types.js'

/**
 * JavaScript 模式下需要跳过的 TS 专属文件（相对 files/ 的路径）。
 */
const TS_ONLY_FILES = new Set(['tsconfig.json'])

/**
 * JS 模式下应从 devDependencies 中过滤掉的 TS 工具链依赖。
 */
const TS_ONLY_PACKAGES = new Set([
  'typescript',
  'tsx',
  'tsdown',
  'typescript-eslint',
])

/**
 * 判断某个包是否为 TS 专属依赖（JS 项目不需要）。
 */
export function isTsOnlyPackage(name: string): boolean {
  return TS_ONLY_PACKAGES.has(name) || name.startsWith('@types/')
}

/**
 * 判断文件在目标语言下是否应被跳过。
 */
export function shouldSkipFile(fileName: string, language: ProjectContext['language']): boolean {
  if (language !== 'javascript') return false
  return TS_ONLY_FILES.has(fileName)
}

/**
 * 将源文件名映射为目标语言下的输出文件名。
 * JS 模式：.ts → .js（.mts → .mjs, .cts → .cjs）；TS 模式原样返回。
 */
export function mapFileName(fileName: string, language: ProjectContext['language']): string {
  const outputName = fileName
    .replace(/\.template$/, '')
    .replace(/^_Dockerfile$/, 'Dockerfile')
  if (language !== 'javascript') return outputName
  return outputName
    .replace(/\.mts$/, '.mjs')
    .replace(/\.cts$/, '.cjs')
    .replace(/\.ts$/, '.js')
}

/**
 * 将 TypeScript 源码剥离类型注解，输出纯 JavaScript（ESM）。
 * 仅做语法转换，不做类型检查；import 路径中的 .js 扩展名保持不变。
 */
export function stripTypes(source: string): string {
  const result = transformSync(source, {
    loader: 'ts',
    format: 'esm',
    target: 'node20',
    sourcemap: false,
    sourcesContent: false,
  })
  return result.code
}
