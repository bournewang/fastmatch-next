import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const userId = uuidv4()

    await query(`
      INSERT INTO users (id, name, email, password, gender)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, data.name, data.email, data.password, data.gender])

    const response = NextResponse.json({ success: true })

    // Set auth cookie
    response.cookies.set({
      name: 'auth-token',
      value: userId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 