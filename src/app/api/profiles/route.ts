import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'
import type { User } from '@/types'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth-token')?.value

    if (!userId) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // First, get the current user's gender to recommend opposite gender
    const currentUser = await query<User>(`
      SELECT gender FROM users WHERE id = ?
    `, [userId])

    if (!currentUser || currentUser.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    const targetGender = currentUser[0].gender === 0 ? 1 : 0  // 0: male, 1: female

    // Get profiles with updated fields
    const profiles = await query<User>(`
      SELECT u.id, u.name, u.gender, u.location, 
             u.career_id, u.career_name, u.company_type,
             u.annual_income, u.education, u.school, u.about
      FROM users u
      WHERE u.gender = ?
      AND u.id != ?
      AND u.id NOT IN (
        SELECT 
          CASE 
            WHEN user1_id = ? THEN user2_id 
            ELSE user1_id 
          END
        FROM matches 
        WHERE user1_id = ? OR user2_id = ?
      )
      LIMIT 10
    `, [targetGender, userId, userId, userId, userId])

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Profiles fetch error:', error)
    return NextResponse.json(
      { error: '获取推荐失败' },
      { status: 500 }
    )
  }
} 