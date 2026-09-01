import type {
  Architecture,
  Cache,
  Database,
  Framework,
  Language,
  Orm,
  PackageManagerName,
  Runtime,
  Test,
} from '../config/options.js'

/**
 * 整个系统唯一的核心数据结构。
 * 所有下游模块（validation / resolver / generator / merger / runtime）只读写它，
 * 不关心用户是通过 Prompt、CLI 参数、Preset 还是 Config 做出的选择。
 */
export interface ProjectContext {
  // ── 项目基础 ──
  projectName: string
  projectPath: string

  // ── 技术选择 ──
  runtime: Runtime
  language: Language
  framework: Framework
  database: Database
  orm: Orm
  cache: Cache
  test: Test
  architecture: Architecture

  // ── 工程化 ──
  eslint: boolean
  prettier: boolean
  docker: boolean

  // ── 执行行为 ──
  packageManager: PackageManagerName
  noInstall: boolean
  noGit: boolean
}
