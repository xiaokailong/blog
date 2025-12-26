import { NextResponse } from 'next/server'
import { d1Helper } from '@/lib/d1'
import { getDB } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const db = getDB()
    
    // 获取访客IP（简化版）
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    try {
      // 记录点赞
      await d1Helper.execute(
        db,
        `INSERT INTO site_likes (ip_address, liked_at) 
         VALUES (?, datetime('now'))`,
        [ip]
      )

      // 获取更新后的总点赞数
      const result = await d1Helper.queryOne(
        db,
        'SELECT COUNT(*) as count FROM site_likes'
      )
      
      return NextResponse.json({ 
        success: true,
        totalLikes: result?.count || 0
      })
    } catch (error) {
      console.error('Error recording like:', error)
      return NextResponse.json({ success: true, totalLikes: 0 })
    }
  } catch (error) {
    console.error('Error in POST /api/stats/like:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
