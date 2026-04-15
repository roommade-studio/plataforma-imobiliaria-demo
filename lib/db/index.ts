import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type DbInstance = ReturnType<typeof drizzle<typeof schema>>

let _db: DbInstance | null = null

export function getDb(): DbInstance {
  if (_db) return _db

  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL não definida. Verifique o arquivo .env.local')

  _db = drizzle(neon(url), { schema })
  return _db
}

// Alias conveniente para uso em Server Actions
export { getDb as db }
export * from './schema'
