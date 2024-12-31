import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth-token')?.value

    if (!userId) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const { profileId, action } = await request.json()

    if (!profileId || !action) {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      )
    }

    const status = action === 'like' ? 'pending' : 'declined'

    await query(`
      INSERT INTO matches (user1_id, user2_id, status)
      VALUES (?, ?, ?)
    `, [userId, profileId, status])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Match action error:', error)
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    )
  }
} 