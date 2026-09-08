import path from 'node:path'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { pathExists } from 'fs-extra'

import { mergeFile } from '../merger/index.js'
import type { TemplateMeta } from '../resolver/dependency.js'
import { getTemplatesRoot } from '../utils/paths.js'
import { mapFileName, shouldSkipFile, stripTypes } from './language.js'
import { renderContent, type TemplateVariables } from './render.js'

/**
 * 读取单个模板模块的 template.json 元数据。
 * 依赖 / 脚本 / 环境变量都声明在这里，由 Dependency Resolver 统一合并。
 */
export async function loadTemplateMeta(
  templatePath: string,
  variables: TemplateVariables = {},
): Promise<TemplateMeta> {
  const metaPath = path.join(getTemplatesRoot(), templatePath, 'template.json')
  const content = await readFile(metaPath, 'utf-8')
  return JSON.parse(renderContent(content, variables)) as TemplateMeta
}

/**
 * 复制一个模板模块 files/ 下的所有静态文件到目标项目。
 * - 文件内容会经过 {{variable}} 变量渲染；
 * - JavaScript 模式下 .ts 文件剥离类型后输出为 .js，并跳过 tsconfig.json；
 * - 后加载的模板覆盖先加载模板的同路径文件（覆盖顺序 = resolver 顺序）。
 */
export async function copyTemplateFiles(
  templatePath: string,
  projectPath: string,
  variables: TemplateVariables,
): Promise<void> {
  const filesDir = path.join(getTemplatesRoot(), templatePath, 'files')
  if (!(await pathExists(filesDir))) return

  const language = (variables.language ?? 'typescript') as 'typescript' | 'javascript'
  await copyDir(filesDir, projectPath, variables, language)
}

async function copyDir(
  sourceDir: string,
  targetDir: string,
  variables: TemplateVariables,
  language: 'typescript' | 'javascript',
): Promise<void> {
  const entries = await readdir(sourceDir, { withFileTypes: true })
  await mkdir(targetDir, { recursive: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)

    // JS 模式跳过 TS 专属文件（如 tsconfig.json）
    if (entry.isFile() && shouldSkipFile(entry.name, language)) {
      continue
    }

    const outputName = mapFileName(entry.name, language)
    const targetPath = path.join(targetDir, outputName)

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath, variables, language)
    } else if (entry.isFile()) {
      let rendered = renderContent(await readFile(sourcePath, 'utf-8'), variables)

      // JS 模式：把 TS 源码剥离为 JS
      if (language === 'javascript' && entry.name.endsWith('.ts')) {
        rendered = stripTypes(rendered)
      }

      // 尝试按策略合并（JSON/ENV）；不支持合并或目标不存在时直接写入
      const tmpPath = `${targetPath}.cna-tmp`
      await writeFile(tmpPath, rendered)
      const merged = await mergeFile(tmpPath, targetPath)
      if (!merged) {
        await writeFile(targetPath, rendered)
      }
      await unlink(tmpPath)
    }
  }
}
