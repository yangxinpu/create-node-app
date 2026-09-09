import { readFileSync } from 'node:fs'

import express from 'express'

import { expressRequestLogger } from './middleware/logger.{{extension}}'
import { health } from './routes/health.{{extension}}'

export const app = express()
const homePage = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8')

app.use(express.json())
app.use((request, response, next) => expressRequestLogger(request, response, next))
app.get('/', (_req, res) => {
  res.type('html').send(homePage)
})
app.get('/api/greetings', (_req, res) => {
  res.json({ data: { message: 'Hello Node App' } })
})
app.use(health)

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`Express is running at http://localhost:${port}`)
})
