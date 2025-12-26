import { NextResponse } from 'next/server'
import { d1Helper } from '@/lib/d1'
import { getDB } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = getDB()
    
    // 从 homepage 表获取所有数据
    let homepageData
    try {
      homepageData = await d1Helper.queryOne(
        db,
        'SELECT * FROM homepage WHERE id = 1'
      )
    } catch (error) {
      console.error('Error fetching homepage data:', error)
      
      // 如果表不存在或查询失败，尝试创建表
      try {
        await d1Helper.execute(db, `
          CREATE TABLE IF NOT EXISTS homepage (
            id INTEGER PRIMARY KEY DEFAULT 1,
            introduction TEXT DEFAULT 'Hello guys! I''m a Senior Frontend Engineer at a Fortune 500 multinational corporation, where I bring creativity and technical excellence to crafting exceptional web experiences.',
            site_start_date TEXT DEFAULT '2025-12-23',
            visit_count INTEGER DEFAULT 0,
            like_count INTEGER DEFAULT 0,
            updated_at TEXT DEFAULT (datetime('now')),
            CHECK (id = 1)
          )
        `)
        
        // 插入初始数据
        await d1Helper.execute(db, `
          INSERT OR IGNORE INTO homepage (id, site_start_date, visit_count, like_count)
          VALUES (1, '2025-12-23', 0, 0)
        `)
        
        // 再次查询
        homepageData = await d1Helper.queryOne(
          db,
          'SELECT * FROM homepage WHERE id = 1'
        )
      } catch (initError) {
        console.error('Error initializing homepage table:', initError)
        // 返回默认值
        homepageData = {
          introduction: 'Hello guys! I\'m a Senior Frontend Engineer at a Fortune 500 multinational corporation.',
          site_start_date: '2025-12-23',
          visit_count: 0,
          like_count: 0
        }
      }
    }

    // 计算网站运行天数
    const startDate = new Date(homepageData.site_start_date || '2025-12-23')
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - startDate.getTime())
    const daysRunning = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      success: true,
      data: {
        introduction: homepageData.introduction || '',
        siteStartDate: homepageData.site_start_date,
        daysRunning,
        visitCount: homepageData.visit_count || 0,
        likeCount: homepageData.like_count || 0
      }
    })
  } catch (error) {
    console.error('Error in GET /api/stats:', error)
    // 返回默认值而不是错误
    return NextResponse.json({
      success: true,
      data: {
        introduction: '',
        siteStartDate: '2025-12-23',
        daysRunning: 4,
        visitCount: 0,
        likeCount: 0
      }
    })
  }
}

// 记录访问（每次访问+1，不管是谁）
export async function POST() {
  try {
    const db = getDB()
    
    try {
      // 增加访问计数
      await d1Helper.execute(
        db,
        `UPDATE homepage SET visit_count = visit_count + 1, updated_at = datetime('now') WHERE id = 1`
      )
      
      // 获取更新后的数据
      const result = await d1Helper.queryOne(
        db,
        'SELECT visit_count FROM homepage WHERE id = 1'
      )
      
      return NextResponse.json({ 
        success: true,
        visitCount: result?.visit_count || 0
      })
    } catch (error) {
      console.error('Error recording visit:', error)
      return NextResponse.json({ success: true, visitCount: 0 })
    }
  } catch (error) {
    console.error('Error in POST /api/stats:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
