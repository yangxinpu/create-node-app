import express from 'express'

import { health } from './routes/health.js'

export const app = express()

app.use(express.json())
app.use(health)

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`Express is running at http://localhost:${port}`)
})
