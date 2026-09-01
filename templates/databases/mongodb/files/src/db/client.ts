import { MongoClient } from 'mongodb'

export const client = new MongoClient(process.env.DATABASE_URL!)

export async function connect(): Promise<void> {
  await client.connect()
}

export async function testConnection(): Promise<void> {
  await client.db().command({ ping: 1 })
}
