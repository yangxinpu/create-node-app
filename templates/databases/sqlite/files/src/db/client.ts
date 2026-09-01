import Database from 'better-sqlite3'

const dbPath = (process.env.DATABASE_URL ?? 'file:./data.db').replace('file:', '')

export const db = new Database(dbPath)

export async function testConnection(): Promise<void> {
  db.prepare('SELECT 1').get()
}
