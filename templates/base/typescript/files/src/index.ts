import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'

import { createNodeRequestLogger } from './middleware/logger.{{extension}}'

/* {{healthEntryHandlerSource}} */

const port = Number(process.env.PORT ?? 3000)
const homePage = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8')

export const server = createServer((request, response) => {
  const pathname = request.url?.split('?')[0] ?? '/'
  createNodeRequestLogger(request, response, pathname)

  if (request.method === 'GET' && pathname === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.end(homePage)
    return
  }

  if (request.method === 'GET' && pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(getHealthStatus()))
    return
  }

  if (request.method === 'GET' && pathname === '/api/greetings') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ data: { message: 'Hello Node App' } }))
    return
  }

  response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  response.end('Not found')
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
