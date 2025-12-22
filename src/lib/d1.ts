// Cloudflare D1 数据库访问层 - 适配Next.js环境
import 'server-only'

// 在Next.js API路由中获取D1实例
export function getD1FromEnv(env?: any) {
  // 在Cloudflare Pages环境中，D1会自动注入到context中
  if (env?.DB) {
    return env.DB
  }
  
  // 在本地开发或非Cloudflare环境，返回null
  // API将通过Cloudflare的REST API访问
  return null
}

// Cloudflare D1 REST API访问（用于本地开发和非Cloudflare环境）
async function executeD1RestAPI(sql: string, params: any[] = []) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || '3dd242d5-f86b-4acb-83e8-04945a47a525'
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!accountId || !apiToken) {
    console.warn('Missing Cloudflare credentials. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN')
    // 在构建时返回空结果而不是抛出错误
    return { results: [], success: true, meta: { duration: 0 } }
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`D1 API Error: ${error}`)
  }

  const result = await response.json()
  return result.result?.[0] || { results: [], success: true }
}

// 统一的D1查询接口
export const d1Helper = {
  // 执行查询（返回多条记录）
  async query(db: D1Database | null, sql: string, params: (string | number | boolean | null)[] = []) {
    if (db) {
      // 使用直接的D1连接（Cloudflare环境）
      try {
        const stmt = db.prepare(sql)
        if (params.length > 0) {
          return await stmt.bind(...params).all()
        }
        return await stmt.all()
      } catch (error) {
        console.error('D1 Direct Query Error:', error)
        throw error
      }
    } else {
      // 使用REST API（本地开发环境）
      return await executeD1RestAPI(sql, params)
    }
  },

  // 执行单条记录查询
  async queryOne(db: D1Database | null, sql: string, params: (string | number | boolean | null)[] = []) {
    if (db) {
      try {
        const stmt = db.prepare(sql)
        if (params.length > 0) {
          return await stmt.bind(...params).first()
        }
        return await stmt.first()
      } catch (error) {
        console.error('D1 Direct Query Error:', error)
        throw error
      }
    } else {
      const result = await executeD1RestAPI(sql, params)
      return result.results?.[0] || null
    }
  },

  // 执行插入/更新/删除
  async execute(db: D1Database | null, sql: string, params: (string | number | boolean | null)[] = []) {
    if (db) {
      try {
        const stmt = db.prepare(sql)
        if (params.length > 0) {
          return await stmt.bind(...params).run()
        }
        return await stmt.run()
      } catch (error) {
        console.error('D1 Direct Execute Error:', error)
        throw error
      }
    } else {
      return await executeD1RestAPI(sql, params)
    }
  },

  // 批量执行
  async batch(db: D1Database | null, statements: Array<{ sql: string; params?: (string | number | boolean | null)[] }>) {
    if (db) {
      try {
        const stmts = statements.map(({ sql, params = [] }) => {
          const stmt = db.prepare(sql)
          return params.length > 0 ? stmt.bind(...params) : stmt
        })
        return await db.batch(stmts)
      } catch (error) {
        console.error('D1 Batch Error:', error)
        throw error
      }
    } else {
      // REST API批量执行
      const results = []
      for (const stmt of statements) {
        const result = await executeD1RestAPI(stmt.sql, stmt.params || [])
        results.push(result)
      }
      return results
    }
  }
}

export type D1Database = any
