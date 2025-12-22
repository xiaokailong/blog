import 'server-only'

import { d1Helper, getD1FromEnv } from './d1'

// 全局D1实例缓存
let cachedDb: any = null

// 获取D1数据库实例
export function getDB() {
  // 如果已经有缓存的实例，直接返回
  if (cachedDb) return cachedDb
  
  // 尝试从不同的环境获取D1实例
  // 1. Cloudflare Pages Functions环境
  if (typeof process !== 'undefined' && (process as any).env?.DB) {
    cachedDb = (process as any).env.DB
    return cachedDb
  }
  
  // 2. 通过getCloudflareContext获取（Next.js on Cloudflare）
  try {
    // @ts-ignore - Cloudflare特定API
    if (typeof getCloudflareContext === 'function') {
      // @ts-ignore
      const context = getCloudflareContext()
      if (context?.env?.DB) {
        cachedDb = context.env.DB
        return cachedDb
      }
    }
  } catch (e) {
    // 忽略错误，继续尝试其他方法
  }
  
  // 3. 使用REST API（本地开发或备用方案）
  // d1Helper会自动使用REST API
  return null
}

// ==========================================
// Posts (文章相关函数)
// ==========================================

export async function getAllPosts(preview = false) {
  try {
    const db = getDB()
    const sql = preview
      ? 'SELECT * FROM posts ORDER BY date DESC'
      : 'SELECT * FROM posts WHERE is_draft = 0 ORDER BY date DESC'

    const result = await d1Helper.query(db, sql)
    return result.results.map((post: any) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      content: post.content ? JSON.parse(post.content) : null
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string, preview = false) {
  try {
    const db = getDB()
    const sql = preview
      ? 'SELECT * FROM posts WHERE slug = ?'
      : 'SELECT * FROM posts WHERE slug = ? AND is_draft = 0'

    const result = await d1Helper.queryOne(db, sql, [slug])
    if (!result) return null

    return {
      ...result,
      tags: result.tags ? JSON.parse(result.tags) : [],
      content: result.content ? JSON.parse(result.content) : null
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getPostSlugs() {
  try {
    const db = getDB()
    const sql = 'SELECT slug FROM posts WHERE is_draft = 0'
    const result = await d1Helper.query(db, sql)
    return result.results.map((row: any) => row.slug)
  } catch (error) {
    console.error('Error fetching post slugs:', error)
    return []
  }
}

export async function createPost(data: {
  title: string
  slug: string
  content: any
  excerpt?: string
  date: string
  tags?: string[]
  is_draft?: boolean
}) {
  try {
    const db = getDB()
    const now = new Date().toISOString()
    const sql = `
      INSERT INTO posts (title, slug, content, excerpt, date, first_published_at, published_at, is_draft, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    await d1Helper.execute(db, sql, [
      data.title,
      data.slug,
      JSON.stringify(data.content),
      data.excerpt || '',
      data.date,
      now,
      now,
      data.is_draft ? 1 : 0,
      JSON.stringify(data.tags || []),
      now,
      now
    ])
    return true
  } catch (error) {
    console.error('Error creating post:', error)
    return false
  }
}

export async function updatePost(slug: string, data: Partial<{
  title: string
  content: any
  excerpt: string
  date: string
  tags: string[]
  is_draft: boolean
}>) {
  try {
    const db = getDB()
    const updates: string[] = []
    const params: any[] = []

    if (data.title !== undefined) {
      updates.push('title = ?')
      params.push(data.title)
    }
    if (data.content !== undefined) {
      updates.push('content = ?')
      params.push(JSON.stringify(data.content))
    }
    if (data.excerpt !== undefined) {
      updates.push('excerpt = ?')
      params.push(data.excerpt)
    }
    if (data.date !== undefined) {
      updates.push('date = ?')
      params.push(data.date)
    }
    if (data.tags !== undefined) {
      updates.push('tags = ?')
      params.push(JSON.stringify(data.tags))
    }
    if (data.is_draft !== undefined) {
      updates.push('is_draft = ?')
      params.push(data.is_draft ? 1 : 0)
    }

    updates.push('updated_at = ?')
    params.push(new Date().toISOString())

    params.push(slug)

    const sql = `UPDATE posts SET ${updates.join(', ')} WHERE slug = ?`
    await d1Helper.execute(db, sql, params)
    return true
  } catch (error) {
    console.error('Error updating post:', error)
    return false
  }
}

// ==========================================
// Bookmarks (书签相关函数)
// ==========================================

export async function getBookmarkCollections() {
  try {
    const db = getDB()
    const sql = 'SELECT * FROM bookmark_collections ORDER BY name'
    const result = await d1Helper.query(db, sql)
    return result.results
  } catch (error) {
    console.error('Error fetching bookmark collections:', error)
    return []
  }
}

export async function getBookmarksByCollection(collectionId: number, page = 0, perPage = 50) {
  try {
    const db = getDB()
    const offset = page * perPage
    const sql = `
      SELECT * FROM bookmarks 
      WHERE collection_id = ? AND status = 'approved'
      ORDER BY date DESC
      LIMIT ? OFFSET ?
    `
    const result = await d1Helper.query(db, sql, [collectionId, perPage, offset])
    return result.results
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return []
  }
}

export async function createBookmark(data: {
  url: string
  title?: string
  description?: string
  email?: string
  type?: string
  collection_id?: number
}) {
  try {
    const db = getDB()
    const now = new Date().toISOString()
    const sql = `
      INSERT INTO bookmarks (url, title, description, email, type, status, collection_id, date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `
    await d1Helper.execute(db, sql, [
      data.url,
      data.title || '',
      data.description || '',
      data.email || '',
      data.type || 'Other',
      data.collection_id || null,
      now,
      now,
      now
    ])
    return true
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return false
  }
}

// ==========================================
// View Counts (浏览量相关函数)
// ==========================================

export async function getViewCount(slug: string) {
  try {
    const db = getDB()
    const sql = 'SELECT view_count FROM view_counts WHERE slug = ?'
    const result = await d1Helper.queryOne(db, sql, [slug])
    return result?.view_count || 0
  } catch (error) {
    console.error('Error fetching view count:', error)
    return 0
  }
}

export async function getAllViewCounts() {
  try {
    const db = getDB()
    const sql = 'SELECT slug, view_count FROM view_counts'
    const result = await d1Helper.query(db, sql)
    return result.results
  } catch (error) {
    console.error('Error fetching view counts:', error)
    return []
  }
}

export async function incrementViewCount(slug: string) {
  try {
    const db = getDB()
    
    // 使用 UPSERT 语法（INSERT OR REPLACE）
    const sql = `
      INSERT INTO view_counts (slug, view_count, created_at, updated_at)
      VALUES (?, 1, datetime('now'), datetime('now'))
      ON CONFLICT(slug) DO UPDATE SET 
        view_count = view_count + 1,
        updated_at = datetime('now')
    `
    await d1Helper.execute(db, sql, [slug])
    return true
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return false
  }
}

// ==========================================
// Journey (旅程时间线相关函数)
// ==========================================

export async function getJourneyItems() {
  try {
    const db = getDB()
    const sql = 'SELECT * FROM journey_items ORDER BY date DESC'
    const result = await d1Helper.query(db, sql)
    return result.results
  } catch (error) {
    console.error('Error fetching journey items:', error)
    return []
  }
}
