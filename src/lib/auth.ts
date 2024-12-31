import { cookies } from 'next/headers'
import { queryOne } from './db'
import type { User } from '@/types'
import { cache } from './cache'

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  
  if (!token) {
    return null
  }

  try {
    const user = await queryOne<User>(`
      SELECT * FROM users WHERE id = ?
    `, [token.value])

    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const user = await queryOne(`
      SELECT id FROM users WHERE id = ?
    `, [token])
    
    return !!user
  } catch {
    return false
  }
}

export const clearUserData = () => {
  // Clear all cached data
  cache.remove('profiles')
  cache.remove('matches')
  cache.remove('userProfile')
  
  // Clear auth token
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
} 