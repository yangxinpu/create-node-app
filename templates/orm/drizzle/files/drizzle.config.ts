import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: '{{drizzleDialect}}',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
