import type { Content, Language } from './types'

export const content: Record<Language, Content> = {
  zh: {
    nav: {
      language: '语言',
      theme: '切换主题',
      github: 'GitHub',
    },
    home: {
      eyebrow: 'Node.js 后端脚手架生成器',
      title: 'node-app',
      intro:
        '通过可组合模板快速生成 Node.js 后端项目。选择运行时、框架、数据库、ORM、缓存、工程化和目录结构，即可得到可以安装、启动和继续开发的项目。',
      install: 'npm create node-app@latest my-server',
      copy: '复制命令',
      meta: ['Node.js 24 / 22', 'Bun 1.4 / 1.3', 'RESTful API', 'Docker Ready'],
      highlights: [
        {
          title: '组合式模板',
          text: 'Base、Framework、Database、ORM、Cache、Tooling 和 Architecture 独立组合，避免预置模板爆炸。',
        },
        {
          title: '可运行输出',
          text: '生成项目包含欢迎页、RESTful 示例接口、请求日志、README、运行时版本约束和 Docker 入口。',
        },
        {
          title: '适合自动化',
          text: '支持交互式 TUI、全参数 CLI、Preset 和配置文件，可用于本地初始化与 CI/CD。',
        },
      ],
      stackTitle: '支持范围',
      stackText: 'Node.js / Bun、TypeScript / JavaScript、Express / Elysia / Hono / Fastify。',
      stackItems: ['Runtime', 'Framework', 'Database', 'ORM', 'Cache', 'Tooling'],
    },
    usage: {
      title: '使用方法',
      intro: '首页直接展示最常用的创建方式，复制后即可在终端运行。',
      steps: [
        {
          id: 'interactive',
          title: '交互式创建',
          body: '不传完整参数时，CLI 会依次询问项目名、运行时、框架、数据库和工程化选项。',
          code: 'npm create node-app@latest',
        },
        {
          id: 'quick-start',
          title: '创建并启动',
          body: '生成项目后进入目录，安装依赖并启动开发服务器。',
          code: 'npm create node-app@latest my-server\ncd my-server\nnpm install\nnpm run dev',
        },
        {
          id: 'non-interactive',
          title: '非交互式创建',
          body: '在脚本或 CI/CD 中通过 CLI 参数一次性指定技术栈。',
          code: 'npm create node-app@latest my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
        },
      ],
    },
  },
  en: {
    nav: {
      language: 'Language',
      theme: 'Toggle theme',
      github: 'GitHub',
    },
    home: {
      eyebrow: 'Node.js backend project generator',
      title: 'node-app',
      intro:
        'Generate Node.js backend projects from composable templates. Choose runtime, framework, database, ORM, cache, tooling, and structure to get a project that can install, run, and grow.',
      install: 'npm create node-app@latest my-server',
      copy: 'Copy command',
      meta: ['Node.js 24 / 22', 'Bun 1.4 / 1.3', 'RESTful API', 'Docker Ready'],
      highlights: [
        {
          title: 'Composable templates',
          text: 'Base, Framework, Database, ORM, Cache, Tooling, and Architecture modules compose independently.',
        },
        {
          title: 'Runnable output',
          text: 'Generated projects include a welcome page, RESTful sample API, request logging, README, runtime constraints, and Docker entrypoints.',
        },
        {
          title: 'Automation ready',
          text: 'Use the interactive TUI, full CLI flags, presets, or config files for local setup and CI/CD.',
        },
      ],
      stackTitle: 'Supported stack',
      stackText: 'Node.js / Bun, TypeScript / JavaScript, Express / Elysia / Hono / Fastify.',
      stackItems: ['Runtime', 'Framework', 'Database', 'ORM', 'Cache', 'Tooling'],
    },
    usage: {
      title: 'Usage',
      intro: 'The most common commands are shown directly on the homepage.',
      steps: [
        {
          id: 'interactive',
          title: 'Interactive creation',
          body: 'Without full flags, the CLI prompts for project name, runtime, framework, database, and tooling.',
          code: 'npm create node-app@latest',
        },
        {
          id: 'quick-start',
          title: 'Create and run',
          body: 'After generation, enter the project, install dependencies, and start the dev server.',
          code: 'npm create node-app@latest my-server\ncd my-server\nnpm install\nnpm run dev',
        },
        {
          id: 'non-interactive',
          title: 'Non-interactive creation',
          body: 'Use explicit flags in scripts or CI/CD workflows.',
          code: 'npm create node-app@latest my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
        },
      ],
    },
  },
}
