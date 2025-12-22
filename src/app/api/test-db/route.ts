import { NextResponse } from 'next/server'

import { d1Helper } from '@/lib/d1'
import { getDB } from '@/lib/db'

/**
 * 数据库连接测试端点
 * GET /api/test-db
 */
export async function GET() {
  try {
    const db = getDB()
    
    // 测试查询
    const result = await d1Helper.query(
      db,
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )

    // 获取各表的数据量
    const counts = {
      posts: 0,
      view_counts: 0,
      bookmarks: 0,
      bookmark_collections: 0,
      journey_items: 0
    }

    try {
      const postCount = await d1Helper.queryOne(db, "SELECT COUNT(*) as count FROM posts")
      counts.posts = postCount?.count || 0
    } catch (e) {
      // 表可能不存在
    }

    try {
      const viewCount = await d1Helper.queryOne(db, "SELECT COUNT(*) as count FROM view_counts")
      counts.view_counts = viewCount?.count || 0
    } catch (e) {}

    try {
      const bookmarkCount = await d1Helper.queryOne(db, "SELECT COUNT(*) as count FROM bookmarks")
      counts.bookmarks = bookmarkCount?.count || 0
    } catch (e) {}

    try {
      const collectionCount = await d1Helper.queryOne(db, "SELECT COUNT(*) as count FROM bookmark_collections")
      counts.bookmark_collections = collectionCount?.count || 0
    } catch (e) {}

    try {
      const journeyCount = await d1Helper.queryOne(db, "SELECT COUNT(*) as count FROM journey_items")
      counts.journey_items = journeyCount?.count || 0
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      environment: process.env.NODE_ENV,
      connectionType: db ? 'Direct D1' : 'REST API',
      tables: result.results || [],
      counts: counts,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Database connection failed',
      details: error.toString(),
      environment: process.env.NODE_ENV,
      help: 'Please check your .env.local file contains CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN'
    }, { status: 500 })
  }
}
