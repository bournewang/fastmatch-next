import { D1Database } from '@cloudflare/workers-types'

declare global {
  const DB: D1Database | undefined
}

let devDB: D1Database | null = null
const queryCache = new Map<string, { data: any, timestamp: number }>()
const CACHE_TTL = 5000 // 5 seconds

function escapeSQLValue(value: any): string {
  if (value === null) return 'NULL'
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return `'${value}'`
  }
  return `'${value}'`
}

function getCacheKey(sql: string, params: unknown[]): string {
  return `${sql}-${JSON.stringify(params)}`
}

async function executeQuery(sql: string, params: unknown[]) {
  const { execSync } = require('child_process')
  const fs = require('fs')
  const path = require('path')
  
  // Replace ? with actual values
  const boundSql = sql.replace(/\?/g, () => {
    const param = params.shift()
    return escapeSQLValue(param)
  })
  
  // Write SQL to temp file
  const tempFile = path.join(process.cwd(), '.temp.sql')
  fs.writeFileSync(tempFile, boundSql)
  
  try {
    const result = execSync(
      `npx wrangler d1 execute fastmatch --json --command="${boundSql}"`,
      { encoding: 'utf8' }
    )
    const parsedResult = JSON.parse(result)
    const results = parsedResult[0]?.results || []
    return results
  } finally {
    fs.unlinkSync(tempFile)
  }
}

async function getDB(): Promise<D1Database> {
  if (process.env.NODE_ENV === 'development') {
    if (!devDB) {
      devDB = {
        prepare: (sql: string) => ({
          bind: (...params: any[]) => ({
            all: async () => {
              const cacheKey = getCacheKey(sql, params)
              const cached = queryCache.get(cacheKey)
              
              if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                return { results: cached.data }
              }

              const results = await executeQuery(sql, [...params])
              queryCache.set(cacheKey, {
                data: results,
                timestamp: Date.now()
              })

              return { results }
            },
            first: async function() {
              const { results } = await this.all()
              return results[0] || null
            }
          })
        })
      } as unknown as D1Database
    }
    return devDB
  }
  
  if (!DB) {
    throw new Error('Database not initialized')
  }
  
  return DB
}

export async function query<T>(
  sql: string, 
  params: unknown[] = []
): Promise<T[]> {
  try {
    const db = await getDB()
    const stmt = db.prepare(sql).bind(...params)
    const result = await stmt.all()
    return result.results as T[]
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export async function queryOne<T>(
  sql: string, 
  params: unknown[] = []
): Promise<T | null> {
  try {
    const db = await getDB()
    const stmt = db.prepare(sql).bind(...params)
    const result = await stmt.first()
    return result as T || null
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
} 