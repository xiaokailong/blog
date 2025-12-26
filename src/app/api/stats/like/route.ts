import { NextResponse } from 'next/server'
import { d1Helper } from '@/lib/d1'
import { getDB } from '@/lib/db'
import { handleCors, handleOptions } from '@/lib/cors'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return handleOptions()
}

export async function POST() {
  try {
    const db = getDB()
    
    try {
      // 增加点赞计数
      await d1Helper.execute(
        db,
        `UPDATE homepage SET like_count = like_count + 1, updated_at = datetime('now') WHERE id = 1`
      )

      // 获取更新后的总点赞数
      const result = await d1Helper.queryOne(
        db,
        'SELECT like_count FROM homepage WHERE id = 1'
      )
      
      const response = NextResponse.json({ 
        success: true,
        likeCount: result?.like_count || 0
      })
      return handleCors(response)
    } catch (error) {
      console.error('Error recording like:', error)
      const response = NextResponse.json({ success: true, likeCount: 0 })
      return handleCors(response)
    }
  } catch (error) {
    console.error('Error in POST /api/stats/like:', error)
    const response = NextResponse.json({ success: false }, { status: 500 })
    return handleCors(response)
  }
}
