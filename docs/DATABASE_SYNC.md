# 数据库同步说明

## Cloudflare D1 数据库同步

### 创建点赞表

在Cloudflare Dashboard中执行以下SQL语句：

```sql
-- 创建点赞表
CREATE TABLE IF NOT EXISTS site_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  liked_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_site_likes_ip ON site_likes(ip_address);
CREATE INDEX IF NOT EXISTS idx_site_likes_liked_at ON site_likes(liked_at DESC);
```

### 使用wrangler CLI同步

```bash
# 使用wrangler d1执行SQL文件
npx wrangler d1 execute blog-db --file=./db/init-likes-table.sql --remote

# 或者直接执行SQL命令
npx wrangler d1 execute blog-db --command="CREATE TABLE IF NOT EXISTS site_likes (id INTEGER PRIMARY KEY AUTOINCREMENT, ip_address TEXT NOT NULL, liked_at TEXT DEFAULT (datetime('now')), created_at TEXT DEFAULT (datetime('now')));" --remote
```

### 验证表创建

```bash
# 查看所有表
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote

# 查询点赞表结构
npx wrangler d1 execute blog-db --command="PRAGMA table_info(site_likes);" --remote

# 查询点赞数据
npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM site_likes;" --remote
```

## 重试逻辑

系统已配置3次重试机制：
- 第1次失败后等待1秒重试
- 第2次失败后等待2秒重试
- 第3次失败后等待3秒重试
- 所有重试失败后返回默认值

## 环境变量配置

确保在`.env.local`中配置：

```env
CLOUDFLARE_ACCOUNT_ID=你的账号ID
CLOUDFLARE_D1_DATABASE_ID=3dd242d5-f86b-4acb-83e8-04945a47a525
CLOUDFLARE_API_TOKEN=你的API Token
```

## 注意事项

1. 所有数据库操作都会自动重试3次
2. SSL证书问题会被自动处理
3. 如果连接失败，API会返回默认统计数据，不影响页面正常显示
4. 点赞记录会存储IP地址，用于防刷
