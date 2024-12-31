import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { queryOne, query } from '@/lib/db'
import type { User } from '@/types'

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

    const user = await queryOne<User>(`
      SELECT id, name, email, gender, location, 
             career_id, career_name, company_type, 
             annual_income, education, school, about
      FROM users
      WHERE id = ?
    `, [userId])

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: '获取个人资料失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json()
    const { 
      name, location, career_id, career_name, 
      company_type, annual_income, education, 
      school, about 
    } = body

    await query(`
      UPDATE users
      SET 
        name = COALESCE(?, name),
        location = COALESCE(?, location),
        career_id = COALESCE(?, career_id),
        career_name = COALESCE(?, career_name),
        company_type = COALESCE(?, company_type),
        annual_income = COALESCE(?, annual_income),
        education = COALESCE(?, education),
        school = COALESCE(?, school),
        about = COALESCE(?, about)
      WHERE id = ?
    `, [name, location, career_id, career_name, company_type, 
        annual_income, education, school, about, userId])

    const updatedUser = await queryOne<User>(`
      SELECT id, name, email, gender, location, 
             career_id, career_name, company_type, 
             annual_income, education, school, about
      FROM users
      WHERE id = ?
    `, [userId])

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: '更新个人资料失败' },
      { status: 500 }
    )
  }
} 