import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import type { User } from '@/types'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: '请输入邮箱和密码' },
        { status: 400 }
      )
    }

    // Get user with email only (not password anymore)
    const user = await queryOne<User>(`
      SELECT * FROM users 
      WHERE email = ? 
      COLLATE NOCASE
    `, [email.trim()])
    
    console.log('Query result:', user)

    // Check if user exists and verify password
    console.log('plain password: ', password)
    console.log('user password: ', user.password)
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })

    // Set auth cookie
    response.cookies.set({
      name: 'auth-token',
      value: user.id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
} 