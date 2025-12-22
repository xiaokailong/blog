import { NextResponse } from 'next/server'

import { d1Helper } from '@/lib/d1'
import { getDB } from '@/lib/db'

export const runtime = 'edge'

// 数据库初始化脚本
const INIT_SQL = `
-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  date TEXT NOT NULL,
  first_published_at TEXT NOT NULL,
  published_at TEXT NOT NULL,
  is_draft INTEGER DEFAULT 0,
  tags TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_draft ON posts(is_draft);

-- Create view_counts table
CREATE TABLE IF NOT EXISTS view_counts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_view_counts_slug ON view_counts(slug);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  email TEXT,
  type TEXT DEFAULT 'Other',
  status TEXT DEFAULT 'pending',
  collection_id INTEGER,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_status ON bookmarks(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON bookmarks(collection_id);

-- Create bookmark_collections table
CREATE TABLE IF NOT EXISTS bookmark_collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookmark_collections_slug ON bookmark_collections(slug);

-- Create journey_items table
CREATE TABLE IF NOT EXISTS journey_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT,
  icon TEXT,
  link TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_journey_year ON journey_items(year DESC);
CREATE INDEX IF NOT EXISTS idx_journey_date ON journey_items(date DESC);
`

export async function POST(request: Request) {
  try {
    const { secret, action } = await request.json()

    // 验证密钥
    if (secret !== process.env.DATABASE_INIT_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB()

    if (action === 'init') {
      // 初始化数据库结构
      const statements = INIT_SQL
        .split(';')
        .filter(s => s.trim())
        .map(sql => ({ sql: sql.trim() }))

      await d1Helper.batch(db, statements)

      return NextResponse.json({ 
        success: true, 
        message: 'Database schema initialized successfully' 
      })
    }

    if (action === 'seed') {
      // 插入测试数据
      await d1Helper.execute(db, `
        INSERT OR IGNORE INTO posts (title, slug, content, excerpt, date, first_published_at, published_at, is_draft, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Welcome to My Blog',
        'welcome-to-my-blog',
        JSON.stringify({"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"这是我的第一篇博客文章。欢迎来到我的个人博客！"}]}]}),
        '这是我的第一篇博客文章。欢迎来到我的个人博客！',
        '2024-01-15',
        '2024-01-15T08:00:00.000Z',
        '2024-01-15T08:00:00.000Z',
        0,
        JSON.stringify(["博客", "欢迎"])
      ])

      await d1Helper.execute(db, `
        INSERT OR IGNORE INTO bookmark_collections (name, slug, description, icon, color, count)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['前端开发', 'frontend', '前端开发相关的优质资源', '🎨', '#3B82F6', 0])

      return NextResponse.json({ 
        success: true, 
        message: 'Test data inserted successfully' 
      })
    }

    if (action === 'status') {
      // 检查数据库状态
      const tables = await d1Helper.query(db, 
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
      )
      
      const postCount = await d1Helper.queryOne(db, "SELECT COUNT(*) as count FROM posts")
      const collectionCount = await d1Helper.queryOne(db, "SELECT COUNT(*) as count FROM bookmark_collections")

      return NextResponse.json({ 
        success: true,
        tables: tables.results,
        counts: {
          posts: postCount?.count || 0,
          collections: collectionCount?.count || 0
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: any) {
    console.error('Database init error:', error)
    return NextResponse.json({ 
      error: error.message || 'Database initialization failed',
      details: error.toString()
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== process.env.DATABASE_INIT_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB()

    // 检查数据库状态
    const tables = await d1Helper.query(db, 
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )

    return NextResponse.json({ 
      success: true,
      message: 'Database is accessible',
      tables: tables.results || []
    })

  } catch (error: any) {
    console.error('Database check error:', error)
    return NextResponse.json({ 
      error: error.message || 'Database check failed',
      details: error.toString()
    }, { status: 500 })
  }
}
