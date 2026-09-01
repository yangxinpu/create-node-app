# create-node-app 使用指南

## 环境要求

* **Node.js** >= 18.0.0

* **pnpm**（推荐，本仓库使用 pnpm workspace）

* 如果需要使用 Bun 运行时，需安装 [Bun](https://bun.sh)

***

## 一、开发环境准备

### 1. 克隆仓库

```bash
git clone <repo-url>
cd create-node-app
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建产物

```bash
pnpm build
```

构建后 `dist/index.js` 即为 CLI 入口，`templates/` 目录随包发布。

***

## 二、本地开发

### 以开发模式运行 CLI

```bash
pnpm dev
```

等价于 `tsx src/cli/index.ts`，直接从源码运行，无需构建。

### 类型检查

```bash
pnpm typecheck
```

### 运行测试

```bash
pnpm test          # 单次运行
pnpm test:watch    # 监听模式
```

### 代码检查与格式化

```bash
pnpm lint          # ESLint 检查
pnpm format        # Prettier 格式化
```

***

## 三、使用脚手架生成项目

### 方式一：交互式创建（推荐）

```bash
# 先构建（如果尚未构建）
pnpm build

# 运行 CLI
node dist/index.js
```

或使用开发模式：

```bash
npx tsx src/cli/index.ts
```

CLI 会依次询问以下选项：

```
◇ create-node-app

? Project name: my-server
? Select runtime:    ❯ Node / Bun
? Select language:   ❯ TypeScript / JavaScript
? Select framework:  ❯ Elysia / Hono / Express / Fastify / None
? Select database:   ❯ MySQL / PostgreSQL / SQLite / MongoDB / None
? Select ORM:        ❯ Prisma / Drizzle / None
? Select cache:      ❯ Redis / None
? Select testing:    ❯ Vitest / None
? Select architecture: ❯ minimal / api / layered
? Use ESLint?        ❯ Yes / No
? Use Prettier?      ❯ Yes / No
? Use Docker?        ❯ Yes / No
```

已通过命令行参数提供的选项会自动跳过。

### 方式二：非交互式 — 全参数指定

```bash
node dist/index.js my-server \
  --runtime node \
  --language typescript \
  --framework elysia \
  --database mysql \
  --orm prisma \
  --cache redis \
  --test vitest \
  --architecture api \
  --eslint \
  --prettier \
  --docker
```

### 方式三：使用默认配置（`--yes`）

```bash
node dist/index.js my-server --yes
```

`--yes` 等价于以下默认配置：

| 选项           | 默认值        |
| ------------ | ---------- |
| runtime      | node       |
| language     | typescript |
| framework    | elysia     |
| database     | none       |
| orm          | none       |
| cache        | none       |
| test         | vitest     |
| architecture | minimal    |
| eslint       | true       |
| prettier     | true       |
| docker       | false      |

### 方式四：使用 Preset 预设

```bash
node dist/index.js blog-api --preset api
```

内置四套预设：

| Preset         | runtime | framework | database   | orm     | cache | architecture | docker |
| -------------- | ------- | --------- | ---------- | ------- | ----- | ------------ | ------ |
| `minimal`      | node    | elysia    | none       | none    | none  | minimal      | false  |
| `api`          | node    | elysia    | mysql      | prisma  | redis | api          | true   |
| `fullstack`    | node    | elysia    | postgresql | prisma  | redis | layered      | true   |
| `microservice` | node    | fastify   | postgresql | drizzle | redis | layered      | true   |

Preset 可与 CLI 参数组合使用，CLI 参数覆盖 Preset：

```bash
node dist/index.js my-api --preset api --database postgresql
```

### 方式五：使用配置文件

创建 `node-app.config.ts`：

```typescript
export default {
  runtime: 'node',
  language: 'typescript',
  framework: 'elysia',
  database: 'mysql',
  orm: 'prisma',
  cache: 'redis',
  test: 'vitest',
  eslint: true,
  prettier: true,
  docker: true,
}
```

然后指定 `--config`：

```bash
node dist/index.js my-server --config node-app.config.ts
```

优先级链：**CLI 参数 > Config 文件 > Preset > 默认值**

***

## 四、CLI 参数完整参考

```
create-node-app <project-name> [options]

Options:
  --runtime <runtime>          node | bun
  --language <language>        typescript | javascript
  --framework <framework>      elysia | hono | express | fastify | none
  --database <database>        mysql | postgresql | sqlite | mongodb | none
  --orm <orm>                  prisma | drizzle | none
  --cache <cache>              redis | none
  --test <test>                vitest | none
  --architecture <arch>        minimal | api | layered
  --preset <preset>            minimal | api | fullstack | microservice
  --config <path>              配置文件路径 (node-app.config.ts)
  --eslint                     启用 ESLint
  --prettier                   启用 Prettier
  --docker                     启用 Docker
  --package-manager <mgr>      npm | pnpm | yarn | bun
  --no-install                 跳过依赖安装
  --no-git                     跳过 Git 初始化
  -y, --yes                    使用默认配置（非交互式）
```

### 查看所有支持的选项

```bash
node dist/index.js list
```

输出示例：

```
Runtimes
  ✓ node
  ✓ bun

Frameworks
  ✓ elysia
  ✓ hono
  ✓ express
  ✓ fastify
  ✓ none

Databases
  ✓ mysql
  ✓ postgresql
  ✓ sqlite
  ✓ mongodb
  ✓ none

ORM
  ✓ prisma
  ✓ drizzle
  ✓ none

Cache
  ✓ redis
  ✓ none

Testing
  ✓ vitest
  ✓ none

Architecture
  ✓ minimal
  ✓ api
  ✓ layered
```

***

## 五、生成后的项目结构

### 示例：`--preset api` 生成的项目

```
my-server/
├── prisma/
│   └── schema.prisma          # 根据所选数据库动态渲染
├── src/
│   ├── db/
│   │   ├── client.ts          # 数据库连接客户端
│   │   └── prisma.ts          # Prisma 客户端实例
│   ├── redis/
│   │   └── client.ts          # Redis 客户端
│   ├── routes/                # 路由目录
│   ├── services/              # 业务逻辑层
│   ├── schemas/               # 数据验证 schema
│   ├── app.ts                 # 应用入口
│   └── index.ts               # 启动文件
├── tests/
│   └── health.test.ts         # 健康检查测试
├── .env.example               # 环境变量模板
├── .gitignore
├── Dockerfile                 # Docker 配置（--docker 时）
├── eslint.config.ts           # ESLint 配置（--eslint 时）
├── prettier.config.ts         # Prettier 配置（--prettier 时）
├── tsconfig.json
├── vitest.config.ts           # 测试配置（--test vitest 时）
├── package.json
└── README.md                  # 根据 Stack 动态生成
```

### 架构对比

| Architecture | 生成的 src/ 目录                                                              |
| ------------ | ------------------------------------------------------------------------ |
| `minimal`    | `index.ts`                                                               |
| `api`        | `routes/` + `services/` + `schemas/` + `index.ts`                        |
| `layered`    | `controllers/` + `services/` + `repositories/` + `schemas/` + `index.ts` |

***

## 六、生成项目的启动流程

```bash
# 1. 生成项目
node dist/index.js my-server --preset api

# 2. 进入项目目录
cd my-server

# 3. 安装依赖（如果生成时未自动安装）
npm install

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际的数据库/Redis 连接信息

# 5. 启动开发服务器
npm run dev

# 6. 运行测试
npm test

# 7. 数据库迁移（如果使用了 Prisma）
npx prisma generate
npx prisma migrate dev
```

***

## 七、兼容性规则

脚手架内置兼容性引擎，会自动检测技术栈组合：

| 规则                      | 级别      | 说明                              |
| ----------------------- | ------- | ------------------------------- |
| `orm-requires-database` | error   | 选了 ORM 但没有数据库                   |
| `drizzle-mongodb`       | error   | Drizzle 不支持 MongoDB             |
| `elysia-runtime`        | warning | Elysia 在 Node.js 上通过 adapter 运行 |
| `prisma-sqlite-bun`     | warning | Prisma + SQLite + Bun 支持有限      |
| `express-bun`           | warning | Express 在 Bun 上支持有限             |
| `fastify-bun`           | warning | Fastify 在 Bun 上支持有限             |

error 级别会阻止项目生成，warning 级别会提示但继续。

***

## 八、全局安装（可选）

如果希望全局使用 `create-node-app` 命令：

```bash
# 本地 link
pnpm link --global

# 之后可以在任意目录使用
create-node-app my-server --preset api
```

***

## 九、通过 npx 直接运行（发布后）

发布到 npm 后，用户可以通过 `npm create` 使用：

```bash
# 交互式
npm create node-app@latest

# 指定项目名
npm create node-app@latest my-server

# 使用 preset
npm create node-app@latest my-server -- --preset api

# 全参数非交互式
npm create node-app@latest my-server -- \
  --runtime node \
  --framework elysia \
  --database mysql \
  --orm prisma \
  --yes
```

> **注意**：通过 `npm create` 使用时需要在选项前加 `--` 分隔符。

***

## 十、常见问题

### Q: 生成时报 "Target directory already exists"

目标目录已存在，请删除后重试或更换项目名称：

```bash
rm -rf my-server
```

### Q: 如何跳过依赖安装和 Git 初始化？

```bash
node dist/index.js my-server --yes --no-install --no-git
```

### Q: 如何指定包管理器？

```bash
node dist/index.js my-server --yes --package-manager pnpm
```

### Q: 生成的 Prisma schema 怎么对应选的数据库？

脚手架会根据 `--database` 自动渲染 `schema.prisma` 中的 `provider` 字段和 User 模型：

* `mysql` → `provider = "mysql"`，`Int @id @default(autoincrement())`

* `postgresql` → `provider = "postgresql"`，同上

* `sqlite` → `provider = "sqlite"`，同上

* `mongodb` → `provider = "mongodb"`，`String @id @default(auto()) @db.ObjectId`

### Q: 生成的 Drizzle 文件怎么对应选的数据库？

同样根据 `--database` 动态渲染 `schema.ts`、`client.ts` 和 `drizzle.config.ts` 中的方言和驱动：

* `mysql` → `drizzle-orm/mysql-core` + `mysql2/promise`

* `postgresql` → `drizzle-orm/pg-core` + `pg`

* `sqlite` → `drizzle-orm/sqlite-core` + `better-sqlite3`

