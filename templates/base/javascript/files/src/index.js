import { createServer } from 'node:http'

import { getHealthStatus } from './health.js'
import { homePage } from './home.js'

const port = Number(process.env.PORT ?? 3000)

export const server = createServer((request, response) => {
  const pathname = request.url?.split('?')[0]

  if (pathname === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.end(homePage)
    return
  }

  if (pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(getHealthStatus()))
    return
  }

  if (pathname === '/api/hello') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ message: 'Hello Node App' }))
    return
  }

  response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  response.end('Not found')
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
