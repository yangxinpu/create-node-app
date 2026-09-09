# create-node-web

<p align="center">
  <a href="#简体中文">简体中文</a> |
  <a href="#english">English</a>
</p>

<a id="简体中文"></a>

## 简体中文

一个可组合的 Node.js 后端项目脚手架。通过交互式 TUI、命令行参数、Preset
或配置文件，自由组合 Runtime、Framework、Database、ORM、Cache、Tooling
和 Architecture，生成可以直接安装、运行和继续开发的项目。

> 当前版本：`0.1.0`

### 特性

- **组合式模板**：按需组合独立模块，不维护大量预组合项目模板。
- **双运行时**：支持 Node.js 24 / 22 LTS 和 Bun 1.4 / 1.3 稳定版本线。
- **多种技术栈**：支持 Express、Elysia、Hono、Fastify，以及常用数据库和 ORM。
- **三种项目结构**：提供 `minimal`、`api`、`layered` 三种代码组织方式。
- **工程化配置**：可选 ESLint、Prettier、Docker、依赖安装和 Git 初始化。
- **多种输入方式**：支持交互式 TUI、完整 CLI 参数、Preset 和配置文件。
- **版本一致性**：运行时版本会同步到 engines、版本文件、类型依赖和 Docker 镜像。
- **启动欢迎页**：运行后查看所选技术栈、切换中英文，并测试前后端请求。
- **请求日志**：生成 `src/middleware/logger.*`，使用框架原生中间件记录方法、路径、状态码和耗时。

### 快速开始

#### 交互式创建

```bash
npm create node-web@latest
```

也可以直接指定项目名称：

```bash
npm create node-web@latest my-server
```

CLI 会通过接近 Vite 的连续式 TUI 引导完成配置：

```text
┌  create-node-web
│
◇  Project name
◇  Runtime
◇  Node.js LTS version / Bun stable version
◇  Language
◇  Framework
◇  Database
◇  ORM
◇  Cache
◇  Project structure
◇  Tooling
│
└  Done
```

未选择数据库时会跳过 ORM；ESLint、Prettier 和 Docker 会集中在 Tooling
多选步骤中。

#### 使用默认配置

```bash
npm create node-web@latest my-server -- --yes
```

默认生成以下组合：

```text
Node.js 24 LTS + TypeScript + Express + Minimal + ESLint + Prettier
```

#### 完整参数创建

```bash
npm create node-web@latest my-server -- \
  --runtime node \
  --runtime-version 24 \
  --language typescript \
  --framework express \
  --database postgresql \
  --orm drizzle \
  --cache redis \
  --architecture api \
  --eslint \
  --prettier \
  --docker
```

### 支持范围

| 类型            | 可选项                                         |
| --------------- | ---------------------------------------------- |
| Runtime         | `node`、`bun`                                  |
| Runtime version | Node.js：`24`、`22`；Bun：`1.4`、`1.3`         |
| Language        | `typescript`、`javascript`                     |
| Framework       | `express`、`elysia`、`hono`、`fastify`、`none` |
| Database        | `mysql`、`postgresql`、`mongodb`、`none`       |
| ORM             | `prisma`、`drizzle`、`none`                    |
| Cache           | `redis`、`none`                                |
| Architecture    | `minimal`、`api`、`layered`                    |
| Tooling         | ESLint、Prettier、Docker                       |
| Package manager | `npm`、`pnpm`、`yarn`、`bun`                   |

Bun 当前没有正式 LTS 通道，因此 CLI 将 Bun 版本标记为稳定版本线，而不是
LTS。

### Architecture 选择

Architecture 只决定项目的代码组织方式，不绑定具体 Framework。

| 选项      | 结构                                                                        | 适用场景               |
| --------- | --------------------------------------------------------------------------- | ---------------------- |
| `minimal` | `middleware/`；健康检查直接位于 Framework 路由                              | Demo、小工具和简单服务 |
| `api`     | `middleware/` + `services/` + `schemas/`                                    | 常规后端 API           |
| `layered` | `middleware/` + `controllers/` + `services/` + `repositories/` + `schemas/` | 复杂业务和长期维护项目 |

框架负责入口与路由，Architecture 负责业务代码分层，两者可以独立组合。详细设计见
[Architecture.md](./Architecture.md)。

### Preset

Preset 是一份预设配置，仍然使用相同的生成流程。

```bash
npm create node-web@latest blog-api -- --preset api
```

| Preset         | Runtime    | Framework | Database   | ORM     | Cache | Architecture | Docker |
| -------------- | ---------- | --------- | ---------- | ------- | ----- | ------------ | ------ |
| `minimal`      | Node.js 24 | Express   | None       | None    | None  | Minimal      | No     |
| `api`          | Node.js 24 | Elysia    | MySQL      | Prisma  | Redis | API          | Yes    |
| `fullstack`    | Node.js 24 | Elysia    | PostgreSQL | Prisma  | Redis | Layered      | Yes    |
| `microservice` | Node.js 24 | Fastify   | PostgreSQL | Drizzle | Redis | Layered      | Yes    |

CLI 参数可以覆盖 Preset 中的字段：

```bash
npm create node-web@latest my-api -- \
  --preset api \
  --database postgresql
```

### 配置文件

项目支持 JavaScript 或 TypeScript 配置文件：

```typescript
// node-web.config.ts
export default {
  runtime: 'node',
  runtimeVersion: '24',
  language: 'typescript',
  framework: 'express',
  database: 'postgresql',
  orm: 'drizzle',
  cache: 'redis',
  architecture: 'api',
  eslint: true,
  prettier: true,
  docker: true,
  packageManager: 'pnpm',
}
```

```bash
npm create node-web@latest my-server -- --config node-web.config.ts
```

配置优先级：

```text
CLI 参数 > Config 文件 > Preset > 默认配置
```

### CLI 参数

```text
create-node-web <project-name> [options]

Options:
  --runtime <runtime>          node | bun
  --runtime-version <version>  node: 24 | 22; bun: 1.4 | 1.3
  --language <language>        typescript | javascript
  --framework <framework>      express | elysia | hono | fastify | none
  --database <database>        mysql | postgresql | mongodb | none
  --orm <orm>                  prisma | drizzle | none
  --cache <cache>              redis | none
  --architecture <arch>        minimal | api | layered
  --preset <preset>            minimal | api | fullstack | microservice
  --config <path>              path to node-web.config.ts or .js
  --eslint                     enable ESLint
  --prettier                   enable Prettier
  --docker                     enable Docker
  --package-manager <manager>  npm | pnpm | yarn | bun
  --no-install                 skip dependency installation
  --no-git                     skip Git initialization
  -y, --yes                    use default configuration
```

查看当前支持的全部选项：

```bash
npm create node-web@latest -- list
```

### 生成结果

以 `api` 架构、PostgreSQL、Drizzle 和 Redis 为例：

```text
my-server/
├── src/
│   ├── db/
│   │   ├── client.ts
│   │   └── schema.ts
│   ├── redis/
│   │   └── client.ts
│   ├── routes/
│   │   └── health.ts
│   ├── schemas/
│   │   └── health.ts
│   ├── services/
│   │   └── health.ts
│   ├── health.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── web/
│   └── index.html              # 项目欢迎页与技术栈概览
├── Dockerfile
├── drizzle.config.ts
├── eslint.config.js
├── prettier.config.js
├── tsconfig.json
├── package.json
└── README.md
```

实际文件由所选模块共同决定。生成项目不会附带测试框架、测试脚本或测试文件。
启动开发服务器后，访问 [http://localhost:3000](http://localhost:3000) 可查看欢迎页；
页面支持中英文切换，并可请求 RESTful 资源 `GET /api/greetings` 显示
`Hello Node App`。所有请求会输出方法、路径、状态码和耗时日志；
`GET /health` 继续提供服务健康状态。

运行时版本会应用到：

- `package.json#engines`
- Node.js 项目的 `.nvmrc`
- Bun 项目的 `.bun-version`
- TypeScript 的 `@types/node` 或 `@types/bun`
- Docker 基础镜像

### 兼容性规则

生成前会执行配置校验和兼容性检查：

| 组合                  | 结果       |
| --------------------- | ---------- |
| ORM + `database=none` | 阻止生成   |
| Drizzle + MongoDB     | 阻止生成   |
| Elysia + Node.js      | 警告并继续 |
| Express + Bun         | 警告并继续 |
| Fastify + Bun         | 警告并继续 |

### 本地开发

环境要求：

- Node.js >= 18
- pnpm

```bash
git clone https://github.com/yangxinpu/create-node-web.git
cd create-node-web
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm build       # 构建 CLI
pnpm test        # 运行测试
pnpm test:watch  # 监听测试
pnpm typecheck   # TypeScript 类型检查
pnpm lint        # ESLint 检查
pnpm format      # Prettier 格式化
```

构建后也可以直接运行：

```bash
node dist/index.js
```

### 项目文档

- [Architecture.md](./Architecture.md)：系统架构、模块职责、生成流水线和扩展方式。
- [AGENTS.md](./AGENTS.md)：AI 编码助手使用的项目约束和开发规范。

### License

[MIT](./LICENSE)

---

<a id="english"></a>

## English

A composable backend project scaffolder for Node.js and Bun. Build a ready-to-run project by
combining a runtime, framework, database, ORM, cache, tooling, and project architecture through an
interactive TUI, CLI arguments, presets, or a configuration file.

> Current version: `0.1.0`

### Features

- **Composable templates**: Combine independent modules instead of maintaining prebuilt template
  permutations.
- **Two runtimes**: Supports Node.js 24 / 22 LTS and Bun 1.4 / 1.3 stable release lines.
- **Multiple stacks**: Supports Express, Elysia, Hono, Fastify, common databases, and ORMs.
- **Three project structures**: Choose from `minimal`, `api`, and `layered`.
- **Optional tooling**: Add ESLint, Prettier, Docker, dependency installation, and Git
  initialization.
- **Flexible configuration**: Use the interactive TUI, complete CLI arguments, presets, or a
  configuration file.
- **Consistent runtime versions**: Keeps engines, version files, runtime types, and Docker images
  aligned.
- **Built-in welcome page**: View the selected stack, switch languages, and test a frontend-backend
  request after starting the generated project.
- **Request logging**: Generate `src/middleware/logger.*` and use framework-native middleware to log
  method, path, status code, and duration.

### Quick Start

#### Interactive

```bash
npm create node-web@latest
```

You can also provide the project name directly:

```bash
npm create node-web@latest my-server
```

The Vite-inspired TUI guides you through the available options:

```text
┌  create-node-web
│
◇  Project name
◇  Runtime
◇  Node.js LTS version / Bun stable version
◇  Language
◇  Framework
◇  Database
◇  ORM
◇  Cache
◇  Project structure
◇  Tooling
│
└  Done
```

The ORM prompt is skipped when no database is selected. ESLint, Prettier, and Docker are grouped
into a single Tooling step.

#### Default Configuration

```bash
npm create node-web@latest my-server -- --yes
```

This generates the following stack:

```text
Node.js 24 LTS + TypeScript + Express + Minimal + ESLint + Prettier
```

#### Full CLI Configuration

```bash
npm create node-web@latest my-server -- \
  --runtime node \
  --runtime-version 24 \
  --language typescript \
  --framework express \
  --database postgresql \
  --orm drizzle \
  --cache redis \
  --architecture api \
  --eslint \
  --prettier \
  --docker
```

### Supported Options

| Category        | Options                                        |
| --------------- | ---------------------------------------------- |
| Runtime         | `node`, `bun`                                  |
| Runtime version | Node.js: `24`, `22`; Bun: `1.4`, `1.3`         |
| Language        | `typescript`, `javascript`                     |
| Framework       | `express`, `elysia`, `hono`, `fastify`, `none` |
| Database        | `mysql`, `postgresql`, `mongodb`, `none`       |
| ORM             | `prisma`, `drizzle`, `none`                    |
| Cache           | `redis`, `none`                                |
| Architecture    | `minimal`, `api`, `layered`                    |
| Tooling         | ESLint, Prettier, Docker                       |
| Package manager | `npm`, `pnpm`, `yarn`, `bun`                   |

Bun does not currently provide an official LTS channel, so the CLI describes Bun versions as
stable release lines rather than LTS releases.

### Architecture Options

Architecture controls how application code is organized and remains independent from the selected
framework.

| Option    | Structure                                                                   | Recommended for                      |
| --------- | --------------------------------------------------------------------------- | ------------------------------------ |
| `minimal` | `middleware/`; health logic directly in the Framework route                 | Demos, utilities, and small services |
| `api`     | `middleware/` + `services/` + `schemas/`                                    | Typical backend APIs                 |
| `layered` | `middleware/` + `controllers/` + `services/` + `repositories/` + `schemas/` | Complex, long-lived applications     |

Framework templates provide the application entry point and routes. Architecture templates provide
the business-layer organization. See [Architecture.md](./Architecture.md) for the complete design.

### Presets

A preset is a predefined configuration that uses the same generation pipeline as every other input
method.

```bash
npm create node-web@latest blog-api -- --preset api
```

| Preset         | Runtime    | Framework | Database   | ORM     | Cache | Architecture | Docker |
| -------------- | ---------- | --------- | ---------- | ------- | ----- | ------------ | ------ |
| `minimal`      | Node.js 24 | Express   | None       | None    | None  | Minimal      | No     |
| `api`          | Node.js 24 | Elysia    | MySQL      | Prisma  | Redis | API          | Yes    |
| `fullstack`    | Node.js 24 | Elysia    | PostgreSQL | Prisma  | Redis | Layered      | Yes    |
| `microservice` | Node.js 24 | Fastify   | PostgreSQL | Drizzle | Redis | Layered      | Yes    |

CLI arguments can override individual preset fields:

```bash
npm create node-web@latest my-api -- \
  --preset api \
  --database postgresql
```

### Configuration File

JavaScript and TypeScript configuration files are supported:

```typescript
// node-web.config.ts
export default {
  runtime: 'node',
  runtimeVersion: '24',
  language: 'typescript',
  framework: 'express',
  database: 'postgresql',
  orm: 'drizzle',
  cache: 'redis',
  architecture: 'api',
  eslint: true,
  prettier: true,
  docker: true,
  packageManager: 'pnpm',
}
```

```bash
npm create node-web@latest my-server -- --config node-web.config.ts
```

Configuration precedence:

```text
CLI arguments > Config file > Preset > Defaults
```

### CLI Reference

```text
create-node-web <project-name> [options]

Options:
  --runtime <runtime>          node | bun
  --runtime-version <version>  node: 24 | 22; bun: 1.4 | 1.3
  --language <language>        typescript | javascript
  --framework <framework>      express | elysia | hono | fastify | none
  --database <database>        mysql | postgresql | mongodb | none
  --orm <orm>                  prisma | drizzle | none
  --cache <cache>              redis | none
  --architecture <arch>        minimal | api | layered
  --preset <preset>            minimal | api | fullstack | microservice
  --config <path>              path to node-web.config.ts or .js
  --eslint                     enable ESLint
  --prettier                   enable Prettier
  --docker                     enable Docker
  --package-manager <manager>  npm | pnpm | yarn | bun
  --no-install                 skip dependency installation
  --no-git                     skip Git initialization
  -y, --yes                    use default configuration
```

List all currently supported options:

```bash
npm create node-web@latest -- list
```

### Generated Project

For example, an API project using PostgreSQL, Drizzle, and Redis can contain:

```text
my-server/
├── src/
│   ├── db/
│   │   ├── client.ts
│   │   └── schema.ts
│   ├── redis/
│   │   └── client.ts
│   ├── routes/
│   │   └── health.ts
│   ├── schemas/
│   │   └── health.ts
│   ├── services/
│   │   └── health.ts
│   ├── health.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── web/
│   └── index.html
├── Dockerfile
├── drizzle.config.ts
├── eslint.config.js
├── prettier.config.js
├── tsconfig.json
├── package.json
└── README.md
```

The exact output depends on the selected modules. Generated projects do not include a test
framework, test scripts, or test files.
After starting the development server, open
[http://localhost:3000](http://localhost:3000) to view the welcome page. It supports English/Chinese
switching and can call the RESTful `GET /api/greetings` resource to display `Hello Node App`.
Every request logs its method, path, status code, and duration. The service health status remains
available from `GET /health`.

The selected runtime version is applied to:

- `package.json#engines`
- `.nvmrc` for Node.js projects
- `.bun-version` for Bun projects
- `@types/node` or `@types/bun` for TypeScript projects
- The Docker base image

### Compatibility Rules

Configuration and compatibility checks run before files are generated:

| Combination           | Result                        |
| --------------------- | ----------------------------- |
| ORM + `database=none` | Generation is blocked         |
| Drizzle + MongoDB     | Generation is blocked         |
| Elysia + Node.js      | Warning; generation continues |
| Express + Bun         | Warning; generation continues |
| Fastify + Bun         | Warning; generation continues |

### Local Development

Requirements:

- Node.js >= 18
- pnpm

```bash
git clone https://github.com/yangxinpu/create-node-web.git
cd create-node-web
pnpm install
pnpm dev
```

Common commands:

```bash
pnpm build       # Build the CLI
pnpm test        # Run the test suite
pnpm test:watch  # Run tests in watch mode
pnpm typecheck   # Check TypeScript types
pnpm lint        # Run ESLint
pnpm format      # Format files with Prettier
```

After building, you can run the CLI directly:

```bash
node dist/index.js
```

### Documentation

- [Architecture.md](./Architecture.md): System architecture, module responsibilities, generation
  pipeline, and extension guidelines.
- [AGENTS.md](./AGENTS.md): Project constraints and development guidelines for AI coding
  assistants.

### License

[MIT](./LICENSE)
