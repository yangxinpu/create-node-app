const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
}

// {{#if framework=none}}
type FinishEmitter = {
  statusCode: number
  once(event: 'finish', listener: () => void): void
}

export function createNodeRequestLogger(
  request: { method?: string },
  response: FinishEmitter,
  pathname: string,
): void {
  const startedAt = performance.now()

  response.once('finish', () => {
    logRequest(request.method ?? 'GET', pathname, response.statusCode, startedAt)
  })
}
// {{/if}}
// {{#if framework=express}}
type FinishEmitter = {
  statusCode: number
  once(event: 'finish', listener: () => void): void
}

type Next = () => void

export function expressRequestLogger(
  request: { method: string; originalUrl: string },
  response: FinishEmitter,
  next: Next,
): void {
  const startedAt = performance.now()

  response.once('finish', () => {
    logRequest(request.method, request.originalUrl, response.statusCode, startedAt)
  })

  next()
}
// {{/if}}
// {{#if framework=fastify}}
const fastifyStartedAt = new WeakMap<object, number>()

export function fastifyRequestLoggerStart(request: { raw: object }): void {
  fastifyStartedAt.set(request.raw, performance.now())
}

export function fastifyRequestLoggerEnd(
  request: { raw: object; method: string; url: string },
  reply: { statusCode: number },
): void {
  const startedAt = fastifyStartedAt.get(request.raw) ?? performance.now()

  logRequest(request.method, request.url, reply.statusCode, startedAt)
  fastifyStartedAt.delete(request.raw)
}
// {{/if}}
// {{#if framework=hono}}
type HonoLoggerContext = {
  req: {
    method: string
    path: string
  }
  res: {
    status: number
  }
}

export async function honoRequestLogger(
  context: HonoLoggerContext,
  next: () => Promise<void>,
): Promise<void> {
  const startedAt = performance.now()

  await next()
  logRequest(context.req.method, context.req.path, context.res.status, startedAt)
}
// {{/if}}
// {{#if framework=elysia}}
type LoggerSet = {
  status?: number | string
}

const elysiaStartedAt = new WeakMap<object, number>()

export function elysiaRequestLoggerStart(context: { request: object }): void {
  elysiaStartedAt.set(context.request, performance.now())
}

export function elysiaRequestLoggerEnd(context: {
  request: { method: string; url: string }
  set: LoggerSet
}): void {
  const startedAt = elysiaStartedAt.get(context.request) ?? performance.now()
  const status = Number(context.set.status ?? 200)
  const pathname = new URL(context.request.url).pathname

  logRequest(context.request.method, pathname, status, startedAt)
  elysiaStartedAt.delete(context.request)
}
// {{/if}}
function logRequest(method: string, pathname: string, status: number, startedAt: number): void {
  const duration = Math.round(performance.now() - startedAt)
  const statusColor = getStatusColor(status)
  const methodText = method.padEnd(7)

  console.log(
    `${colors.dim}HTTP${colors.reset} ${colors.cyan}${methodText}${colors.reset} ${pathname} ${statusColor}${status}${colors.reset} ${colors.dim}${duration}ms${colors.reset}`,
  )
}

function getStatusColor(status: number): string {
  if (status >= 500) return colors.red
  if (status >= 400) return colors.yellow
  if (status >= 300) return colors.cyan
  return colors.green
}
