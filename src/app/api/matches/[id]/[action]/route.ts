import { NextResponse, NextRequest } from 'next/server'
import { getUser } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import type { Match } from '@/types'

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string; action: string }> }
  ) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id, action } = await context.params
    
    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json({ error: '无效的操作' }, { status: 400 })
    }

    // Verify the match exists and belongs to the user
    const match = await queryOne<Match>(`
      SELECT * FROM matches 
      WHERE id = ? 
      AND (user1_id = ? OR user2_id = ?)
      AND status = 'pending'
    `, [id, user.id, user.id])

    if (!match) {
      return NextResponse.json({ error: '匹配不存在' }, { status: 404 })
    }

    // Update match status
    await query(`
      UPDATE matches 
      SET status = ? 
      WHERE id = ?
    `, [action === 'accept' ? 'accepted' : 'declined', id])

    // If both users accepted, create a chat room
    if (action === 'accept') {
      const otherUserAccepted = await queryOne(`
        SELECT status FROM matches 
        WHERE id = ? 
        AND status = 'accepted'
      `, [id])

      if (otherUserAccepted) {
        await query(`
          INSERT INTO chat_rooms (match_id, user1_id, user2_id)
          VALUES (?, ?, ?)
        `, [
          id, 
          match.user1_id, 
          match.user2_id
        ])
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Match action error:', error)
    return NextResponse.json(
      { error: '操作失败，请稍后重试' },
      { status: 500 }
    )
  }
} 