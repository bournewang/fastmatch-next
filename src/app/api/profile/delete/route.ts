import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { query } from '@/lib/db'

export async function DELETE() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // Delete user data
    await query('DELETE FROM users WHERE id = ?', [user.id])

    const response = NextResponse.json({ success: true })

    // Clear auth cookie
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    })

    return response
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: '删除账号失败，请稍后重试' },
      { status: 500 }
    )
  }
} 