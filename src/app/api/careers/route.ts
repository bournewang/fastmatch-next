import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { Career } from '@/types'

export async function GET() {
  try {
    const careers = await query<Career>(`
      SELECT id, name
      FROM careers
      ORDER BY id ASC
    `)

    return NextResponse.json(careers)
  } catch (error) {
    console.error('Careers fetch error:', error)
    return NextResponse.json(
      { error: '获取职业列表失败' },
      { status: 500 }
    )
  }
} 