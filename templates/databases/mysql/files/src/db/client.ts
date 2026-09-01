import mysql from 'mysql2/promise'

export const pool = mysql.createPool(process.env.DATABASE_URL!)

export async function testConnection(): Promise<void> {
  const conn = await pool.getConnection()
  await conn.ping()
  conn.release()
}
