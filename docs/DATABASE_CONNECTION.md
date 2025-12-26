# Cloudflare D1 数据库连接方式总结

## 注意，我们没有本地数据库，本地开发使用的也是生产数据库和生产的接口

## ✅ 推荐方式：使用 wrangler OAuth 登录

### 为什么使用 OAuth？
- ✅ 无需配置复杂的 API Token 权限
- ✅ 通过浏览器授权，简单直观
- ✅ 自动获得所有必需的权限
- ✅ 避免 Authentication Error 10000 错误
- ✅ 不需要担心 Token 过期或权限不足

### 核心步骤

#### 第一步：清理环境变量
```bash
# 确保 .env.local 中注释掉或删除 CLOUDFLARE_API_TOKEN
// CLOUDFLARE_API_TOKEN=your_api_token_here
```

#### 第二步：OAuth 登录
```powershell
# PowerShell
npx wrangler login
```

执行后：
1. 浏览器自动打开 Cloudflare 授权页面
2. 点击 "Allow" 授权
3. 看到 "Successfully logged in." 表示成功

#### 第三步：执行数据库操作

**查询表列表：**
```powershell
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote
```

**执行 SQL 文件：**
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npx wrangler d1 execute blog-db --file=./db/your-script.sql --remote
```

**执行单条 SQL：**
```powershell
npx wrangler d1 execute blog-db --command="CREATE TABLE test (id INTEGER PRIMARY KEY);" --remote
```

**查询数据：**
```powershell
npx wrangler d1 execute blog-db --command="SELECT * FROM posts LIMIT 5;" --remote
```

## 数据库配置信息

在 `wrangler.toml` 中配置：

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "3dd242d5-f86b-4acb-83e8-04945a47a525"
```

在 `.env.local` 中配置：

```env
# 账号ID和数据库ID（用于 REST API）
CLOUDFLARE_ACCOUNT_ID=24c17bbd73ff03387abaa5960296320d
CLOUDFLARE_D1_DATABASE_ID=3dd242d5-f86b-4acb-83e8-04945a47a525

# 不需要 API Token！
# // CLOUDFLARE_API_TOKEN=your_api_token_here
```

## 在代码中访问数据库

### Edge Runtime (Cloudflare Pages)

```typescript
import { getDB } from '@/lib/db'
import { d1Helper } from '@/lib/d1'

export const runtime = 'edge'

export async function GET(request: Request) {
  const db = getDB()
  
  // 查询单条
  const result = await d1Helper.queryOne(
    db,
    'SELECT * FROM homepage WHERE id = ?',
    [1]
  )
  
  // 查询多条
  const results = await d1Helper.query(
    db,
    'SELECT * FROM posts ORDER BY date DESC'
  )
  
  // 执行更新
  await d1Helper.execute(
    db,
    'UPDATE homepage SET visit_count = visit_count + 1 WHERE id = ?',
    [1]
  )
  
  return Response.json({ success: true, data: result })
}
```

### d1Helper API

```typescript
// 查询多条记录
await d1Helper.query(db, sql, params)

// 查询单条记录
await d1Helper.queryOne(db, sql, params)

// 执行插入/更新/删除
await d1Helper.execute(db, sql, params)

// 批量执行
await d1Helper.batch(db, [
  { sql: 'INSERT INTO ...', params: [...] },
  { sql: 'UPDATE ...', params: [...] }
])
```

## 常用命令速查

```powershell
# 登录
npx wrangler login

# 查看登录状态
npx wrangler whoami

# 列出所有数据库
npx wrangler d1 list

# 查看所有表
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote

# 查看表结构
npx wrangler d1 execute blog-db --command="PRAGMA table_info(homepage);" --remote

# 查看表数据
npx wrangler d1 execute blog-db --command="SELECT * FROM homepage;" --remote

# 统计记录数
npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM posts;" --remote

# 删除表
npx wrangler d1 execute blog-db --command="DROP TABLE IF EXISTS old_table;" --remote
```

## 重试机制

代码中已实现 3 次自动重试：

```typescript
// 在 src/lib/d1.ts 中
async function executeD1RestAPI(sql: string, params: any[] = [], retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // 执行请求
      const response = await fetch(...)
      
      if (response.ok) {
        return result
      }
      
      // 失败后等待重试
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }
    } catch (error) {
      // 错误处理
    }
  }
}
```

## 开发环境 vs 生产环境

### 开发环境（本地）
- 通过 Cloudflare REST API 访问
- 需要在 `.env.local` 配置账号ID和数据库ID
- 使用 OAuth 认证或 API Token

### 生产环境（Cloudflare Pages）
- 直接通过 `env.DB` 访问
- 无需额外配置
- 自动绑定到 wrangler.toml 中配置的数据库

```typescript
// getDB() 会自动判断环境
export function getDB() {
  // 在 Cloudflare Pages 环境
  if (typeof process === 'undefined' || !process.env) {
    return null // 会使用 REST API
  }
  return null // 本地开发使用 REST API
}
```

## 故障排除

### 问题：Authentication error [code: 10000]
**原因**：使用了权限不足的 API Token  
**解决**：改用 OAuth 登录（`npx wrangler login`）

### 问题：SSL certificate error
**原因**：SSL 证书验证失败  
**解决**：在代码中已配置自动忽略 SSL 错误（仅开发环境）

### 问题：表不存在
**原因**：数据库未初始化  
**解决**：执行初始化脚本
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npx wrangler d1 execute blog-db--file=./db/schema.sql --remote
```

### 问题：端口被占用
**原因**：3000 端口已被使用  
**解决**：Next.js 会自动使用 3001 端口

## 最佳实践

1. **始终使用 OAuth 登录**，避免 API Token 权限问题
2. **使用事务**处理多个相关操作
3. **添加适当的索引**提高查询性能
4. **使用 `IF NOT EXISTS`** 确保 SQL 可重复执行
5. **本地测试后再部署**到生产环境
6. **定期备份数据库**（通过导出 SQL）

## 完整工作流程

```powershell
# 1. 登录（首次或过期后）
npx wrangler login

# 2. 查看当前表
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote

# 3. 创建/修改表
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npx wrangler d1 execute blog-db --file=./db/new-table.sql --remote

# 4. 验证结果
npx wrangler d1 execute blog-db --command="SELECT * FROM new_table;" --remote

# 5. 启动开发服务器测试
npm run dev

# 6. 部署到生产
npm run build
git push
```

---

**记住：**
- ✅ 使用 `npx wrangler login` 进行 OAuth 认证
- ✅ 不需要配置 CLOUDFLARE_API_TOKEN
- ✅ 所有操作通过 wrangler 命令行工具
- ✅ 代码会自动重试 3 次
