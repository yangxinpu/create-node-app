import { Pool } from 'pg'

export const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function testConnection(): Promise<void> {
  const client = await pool.connect()
  client.release()
}
