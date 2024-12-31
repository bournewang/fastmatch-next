import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'

type MatchHistory = {
  id: string
  userId: string
  name: string
  gender: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('auth-token')
    const userId = authCookie?.value

    if (!userId) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const matches = await query<MatchHistory>(`
      SELECT 
        m.id,
        CASE 
          WHEN m.user1_id = ? THEN m.user2_id
          ELSE m.user1_id
        END as userId,
        u.name,
        u.gender,
        m.status,
        m.created_at as createdAt
      FROM matches m
      JOIN users u ON (
        CASE 
          WHEN m.user1_id = ? THEN m.user2_id
          ELSE m.user1_id
        END = u.id
      )
      WHERE m.user1_id = ? OR m.user2_id = ?
      ORDER BY m.created_at DESC
    `, [userId, userId, userId, userId])

    return NextResponse.json(matches)
  } catch (error) {
    console.error('Match history fetch error:', error)
    return NextResponse.json(
      { error: '获取匹配记录失败' },
      { status: 500 }
    )
  }
} 