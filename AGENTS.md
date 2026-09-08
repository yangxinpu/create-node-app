# AGENTS.md — create-node-app AI 编码指南

> 本文档专为 AI 编程助手设计。提炼自 README.md 与 Template.md 两份规格文档的核心内容。

---

## 1. 项目定位

**一句话**：一个 Node.js 项目脚手架生成器，通过动态组合模板模块生成完整后端项目。

```bash
npm create node-app@latest my-server          # 非交互式
npm create node-app@latest                     # 交互式
```

**核心原则**：组合而非堆积模板。Base + Framework + Database + ORM + Cache + Tooling + Architecture → 生成项目。严禁预组合模板目录（如 `elysia-mysql-prisma`），会导致 M×N 组合爆炸。

---

## 2. 系统架构

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Interactive │  │  CLI Args   │  │   Preset    │  │ Config File │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       └────────────────┼────────────────┼────────────────┘
                        ↓
                   Normalize
                        ↓
               ┌─────────────────┐
               │  ProjectContext  │ ◀── 系统唯一核心数据结构
               └────────┬────────┘
                        ↓
              ┌────────────────────┐
              │ Schema Validation   │
              │ + Compatibility     │
              └─────────┬──────────┘
                        ↓
              ┌────────────────────┐
              │ Template Resolver   │ ◀── 挑选需要的模块
              └─────────┬──────────┘
                        ↓
              ┌────────────────────┐
              │ Dependency Resolver│ ◀── 合并依赖、脚本、env
              └─────────┬──────────┘
                        ↓
              ┌────────────────────┐
              │  File Generator    │ ◀── 复制静态文件
              └─────────┬──────────┘
                        ↓
              ┌────────────────────┐
              │   File Merger      │ ◀── JSON/ENV/Text 合并
              └─────────┬──────────┘
                        ↓
              ┌────────────────────┐
              │ package.json + .env │
              │    + README.md     │
              └─────────┬──────────┘
                        ↓
              ┌────────────────────┐
              │  Install + Git     │
              └─────────┬──────────┘
                        ↓
                      DONE ✅
```

---

## 3. 核心数据结构

### 3.1 ProjectContext

所有模块唯一读写的数据结构。Generator 不应关心用户是通过 Prompt 还是 CLI 参数做出的选择。

```typescript
export interface ProjectContext {
  // ── 项目基础 ──
  projectName: string
  projectPath: string

  // ── 技术选择 ──
  runtime: 'node' | 'bun'
  language: 'typescript' | 'javascript'
  framework: 'elysia' | 'hono' | 'express' | 'fastify' | 'none'
  database: 'mysql' | 'postgresql' | 'mongodb' | 'none'
  orm: 'prisma' | 'drizzle' | 'none'
  cache: 'redis' | 'none'
  architecture: 'minimal' | 'api' | 'layered'

  // ── 工程化 ──
  eslint: boolean
  prettier: boolean
  docker: boolean
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun'
  noInstall: boolean
  noGit: boolean
}
```

### 3.2 TemplateModule

每个模板目录 = 一个 TemplateModule。这是模板系统的原子单位。

```typescript
export interface TemplateModule {
  name: string
  type:
    | 'base' | 'runtime' | 'framework' | 'database'
    | 'orm' | 'cache' | 'tooling' | 'architecture'

  files?: TemplateFile[]
  dependencies?: {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  scripts?: Record<string, string>
  env?: Record<string, string>

  compatibility?: {
    runtime?: string[]
    language?: string[]
    framework?: string[]
    database?: string[]
    orm?: string[]
  }

  validate?: (context: ProjectContext) => void
  generate?: (context: ProjectContext) => Promise<void>
}
```

### 3.3 CompatibilityRule

兼容性规则独立于模板，由 Compatibility Engine 统一判断。

```typescript
export interface CompatibilityRule {
  name: string
  condition: (context: ProjectContext) => boolean
  level: 'error' | 'warning'
  message: string
}
```

### 3.4 MergeStrategy

文件合并策略，按文件类型分发。

```typescript
export interface MergeStrategy {
  canHandle(file: string): boolean
  merge(source: string, target: string): Promise<void>
}
```

---

## 4. Template Module 规范

### 4.1 标准目录结构

```
template-module/
├── template.json     # 必选 - 模块元数据
├── files/            # 必选 - 静态模板文件
├── package.json      # 可选 - 该模块的依赖声明
├── env.example       # 可选 - 该模块的环境变量
└── generator.ts      # 可选 - 动态生成逻辑
```

`files/` 中以 `.template` 结尾的文件会在生成时移除该后缀。例如
`eslint.config.js.template` 最终生成 `eslint.config.js`。这可避免 IDE 将未渲染的模板误识别为项目配置。

### 4.2 template.json 字段

```json
{
  "name": "elysia",
  "type": "framework",
  "version": "1.0.0",
  "description": "Elysia framework template",
  "dependencies": { "elysia": "^1.3.0" },
  "compatibility": {
    "runtime": ["node", "bun"],
    "language": ["typescript", "javascript"]
  }
}
```

### 4.3 八大类模板

```
templates/
├── base/           typescript | javascript
├── runtimes/       node | bun
├── frameworks/     elysia | hono | express | fastify
├── databases/      mysql | postgresql | mongodb
├── orm/            prisma | drizzle
├── cache/          redis
├── tooling/        eslint | prettier | docker
└── architecture/   minimal | api | layered
```

### 4.4 Template 间关系约束

> **严禁 Template 互相依赖。** 每个 Template 必须独立。组合合法性由 Compatibility Engine 判断，而非 Template 内部硬编码。

```
❌ 错误: Prisma → MySQL（Prisma 模板里写死依赖 MySQL）
✅ 正确: Prisma 和 MySQL 各自独立，由 Compatibility Engine 判断 Prisma + MySQL / Prisma + PostgreSQL 是否合法
```

### 4.5 Architecture 与 Framework 的维度分离

Architecture 描述**项目组织方式**，Framework 描述**技术栈**。这是两个正交维度：

| Architecture | 架构模板增加的文件 |
|-------------|----------------|
| `minimal` | `health.ts` |
| `api` | `health.ts` + `services/health.ts` + `schemas/health.ts` |
| `layered` | `health.ts` + `controllers/` + `services/` + `repositories/` + `schemas/` |

入口文件和框架路由由 Base、Framework 模板提供；Architecture 只负责项目组织方式。

---

## 5. Generator Pipeline

```typescript
async function createProject(context: ProjectContext) {
  // 1. 校验
  await validateContext(context)           // Schema 校验
  await validateCompatibility(context)     // 兼容性规则引擎

  // 2. 解析
  const templates = resolveTemplates(context)
  const dependencies = resolveDependencies(templates)

  // 3. 生成
  await generateFiles(context, templates)   // 复制静态文件
  await mergeFiles(context, templates)      // 按策略合并

  // 4. 组装
  await generatePackageJson(context, dependencies)
  await generateReadme(context)
  await installDependencies(context)
  await initGit(context)

  // 5. 输出
  printNextSteps(context)
}
```

---

## 6. Resolver 逻辑（Template 挑选）

```typescript
function resolveTemplates(ctx: ProjectContext): string[] {
  const t = []
  t.push(`base/${ctx.language}`)
  t.push(`runtimes/${ctx.runtime}`)
  if (ctx.framework !== 'none')  t.push(`frameworks/${ctx.framework}`)
  if (ctx.database !== 'none')   t.push(`databases/${ctx.database}`)
  if (ctx.orm !== 'none')        t.push(`orm/${ctx.orm}`)
  if (ctx.cache !== 'none')      t.push(`cache/${ctx.cache}`)
  if (ctx.eslint)    t.push('tooling/eslint')
  if (ctx.prettier)  t.push('tooling/prettier')
  if (ctx.docker)    t.push('tooling/docker')
  t.push(`architecture/${ctx.architecture}`)
  return t
}
```

---

## 7. File Merge 策略映射

| 文件类型 | 策略 | 说明 |
|---------|------|------|
| `package.json` | JSON Merge | 合并 scripts / dependencies / devDependencies |
| `tsconfig.json` 等 config | JSON Deep Merge | 深度合并配置项 |
| `.env.example` | Environment Merge | 追加环境变量行 |
| `README.md` | Template Rendering | 动态渲染而非合并 |
| 其他静态文件 | Copy | 直接复制 |

MergeStrategy 接口见 §3.4，后续可扩展 YAML、TypeScript 等策略。

---

## 8. CLI 参数完整表

```
create-node-app <project-name> [options]

Options:
  --runtime <runtime>          node | bun
  --language <language>        typescript | javascript
  --framework <framework>     elysia | hono | express | fastify | none
  --database <database>        mysql | postgresql | mongodb | none
  --orm <orm>                 prisma | drizzle | none
  --cache <cache>             redis | none
  --architecture <arch>        minimal | api | layered
  --preset <preset>           minimal | api | fullstack | microservice
  --config <path>             指定配置文件路径
  --package-manager <mgr>     npm | pnpm | yarn | bun
  --eslint                    启用 ESLint
  --prettier                  启用 Prettier
  --docker                    启用 Docker
  --no-install                跳过依赖安装
  --no-git                    跳过 Git 初始化
  --yes                        使用默认配置
```

**默认配置**（`--yes` 等价）：
```
node + typescript + elysia + none + none + none + eslint + prettier
```

---

## 9. Preset 系统

Preset 是 ProjectContext 的预设快照，不是独立的生成逻辑。

```typescript
// presets/api.ts
export default {
  runtime: 'node',
  language: 'typescript',
  framework: 'elysia',
  database: 'mysql',
  orm: 'prisma',
  cache: 'redis',
  eslint: true,
  prettier: true,
  architecture: 'api',
}
```

**数据流**：Preset → Normalize → ProjectContext → 统一 Generator

---

## 10. 项目目录结构

```
create-node-app/
├── src/
│   ├── cli/                 # CLI 入口、命令、prompts
│   ├── context/             # ProjectContext 定义、默认值、normalize
│   ├── validation/          # Schema 校验 + Compatibility Rules
│   ├── resolver/            # Template Resolver + Dependency Resolver + Preset
│   ├── generator/           # 文件生成、package.json、README、env
│   ├── merger/              # File Merge 策略（JSON/ENV/Text）
│   ├── runtime/             # Installer、Git、PackageManager
│   ├── config/              # framework/database/orm 配置与依赖表
│   ├── presets/             # 预设定义
│   └── utils/               # fs / process / logger / paths
├── templates/               # 八类模板模块，由 Resolver / Generator 运行时加载
├── tests/                   # cli / resolver / generator / merger / compatibility
└── ...（package.json, tsconfig.json 等工程配置）
```

**模块依赖方向（严格单向）**：
```
cli → context → validation → resolver → generator → merger → runtime
                    ↑
              config + presets + templates（数据层，被 resolver/generator 读取）
```

---

## 11. 技术栈

| 用途 | 技术 |
|-----|------|
| Language | TypeScript |
| Runtime | Node.js |
| CLI 解析 | Commander |
| 交互式 Prompt | @inquirer/prompts |
| 终端着色 | picocolors |
| 文件操作 | fs-extra |
| 执行外部命令 | execa |
| 构建 | tsdown |
| 测试 | Vitest |

---

## 12. V1 开发阶段

> **V1 目标**：生成的项目能真正安装、启动、开发。不追求覆盖所有组合。

| Phase | 内容 | 交付标准 |
|-------|------|---------|
| **1. CLI 骨架** | Commander + Prompts + Arguments + Logger | `npm create node-app@latest api` 能运行并有交互输出 |
| **2. Context 层** | ProjectContext + Normalize + Defaults + Schema Validation | 能从 CLI/Prompt 输入构建合法 Context |
| **3. Template Engine (MVP)** | 只支持 TypeScript + Node.js + Elysia。Template Resolver + File Generator + package.json Generator | `npm create node-app@latest api && cd api && npm run dev` 真正跑起来 |
| **4. Database** | MySQL / PostgreSQL / MongoDB 模板 | 生成含 db client 与 DATABASE_URL 的项目 |
| **5. ORM** | Prisma + Drizzle + Dependency Resolver + File Merge System | 组合 Database + ORM 时依赖与文件正确合并 |
| **6. Redis** | Redis 模板 + env.example | 生成 `src/redis/client.ts` |
| **7. Tooling** | ESLint / Prettier / Docker / Git | 各工具可独立启用/禁用 |
| **8. Preset + Config** | `--preset` + `node-app.config.ts` | 预设配置文件可驱动生成 |
| **9. Non-Interactive** | 完善所有 `--flag` 参数，支持 CI/CD | 全参数非交互模式可用 |

---

## 13. 关键约束清单

1. **Template 不互相依赖** —— 独立原子，组合由 Resolver + Compatibility Engine 负责
2. **Architecture 与 Framework 解耦** —— 技术栈 × 项目组织方式，两个正交维度
3. **所有输入入口 → 统一 ProjectContext** —— CLI / Prompt / Preset / Config 四种入口最终都 Normalize 到同一个 Context
4. **Generator 只读 Context** —— Generator 不应判断用户从哪来，只看 `context.framework === 'elysia'`
5. **File Merge 按类型分发** —— package.json 用 JSON Merge，.env 用 Environment Merge，而非一刀切的 Copy
6. **Compatibility 规则可扩展** —— 用 `CompatibilityRule[]` 数据驱动，不要写死大量 if-else
7. **V1 不追求全覆盖** —— 先让一条链路跑通（TS + Node + Elysia），再逐类扩展
8. **生成项目不附带测试** —— Vitest 只用于脚手架仓库自身测试，不提供 testing 模板或 `--test` 参数
9. **数据库范围固定** —— 仅支持 MySQL、PostgreSQL、MongoDB 和 none，不提供 SQLite 选项

---

## 14. 验收标准

```bash
npm create node-app@latest blog-api   # 交互式创建
cd blog-api
npm install
npm run dev                           # 启动成功
```

上述命令全部成功，即为可用的 V1。
