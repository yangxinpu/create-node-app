import { app } from './app.{{extension}}'

const port = Number(process.env.PORT ?? 3000)

app.listen(port, ({ hostname, port }) => {
  console.log(`Elysia is running at http://${hostname ?? 'localhost'}:${port}`)
})
