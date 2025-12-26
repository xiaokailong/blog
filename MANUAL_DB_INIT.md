# 🚨 数据库初始化手动步骤指南

由于自动初始化遇到权限问题，请按照以下步骤手动初始化数据库。

---

## ⚠️ 当前问题

- API Token权限不足（错误代码: 10000 - Authentication error）
- 需要重新创建具有正确权限的API Token

---

## ✅ 解决方案：通过Cloudflare Dashboard手动执行

### 步骤 1: 访问数据库控制台

1. 打开浏览器，访问: https://dash.cloudflare.com/24c17bbd73ff03387abaa5960296320d/workers/d1
2. 找到数据库 `blog-db`
3. 点击进入数据库详情页
4. 点击 "Console" 或 "SQL Editor" 标签

### 步骤 2: 执行初始化SQL

在SQL Editor中，**依次**执行以下SQL语句：

#### 1. 创建 posts 表（文章）

```sql
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
```

#### 2. 创建 view_counts 表（浏览量）

```sql
CREATE TABLE IF NOT EXISTS view_counts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_view_counts_slug ON view_counts(slug);
```

#### 3. 创建 bookmarks 表（书签）

```sql
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
```

#### 4. 创建 bookmark_collections 表（书签集合）

```sql
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
```

#### 5. 创建 journey_items 表（旅程）

```sql
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
```

#### 6. 创建 page_views 表（页面访问）

```sql
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  page TEXT NOT NULL,
  visited_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(ip_address, page)
);

CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC);
```

#### 7. 创建 site_likes 表（点赞）

```sql
CREATE TABLE IF NOT EXISTS site_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  liked_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_site_likes_ip ON site_likes(ip_address);
CREATE INDEX IF NOT EXISTS idx_site_likes_liked_at ON site_likes(liked_at DESC);
```

### 步骤 3: 验证表创建

在SQL Editor中执行：

```sql
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
```

应该看到 7 个表:
- ✅ bookmark_collections
- ✅ bookmarks  
- ✅ journey_items
- ✅ page_views
- ✅ posts
- ✅ site_likes
- ✅ view_counts

### 步骤 4: 验证表结构

```sql
-- 查看 posts 表结构
PRAGMA table_info(posts);

-- 查看 page_views 表结构
PRAGMA table_info(page_views);

-- 查看 site_likes 表结构
PRAGMA table_info(site_likes);
```

---

## 🔧 如果仍想使用命令行

### 方法 A: 重新创建API Token

1. 访问: https://dash.cloudflare.com/profile/api-tokens
2. 删除旧的Token（如果有）
3. 创建新Token:
   - Template: Create Custom Token
   - Permissions:
     - **Account** → **D1** → **Edit** ✅
     - **Account** → **Account Settings** → **Read** ✅
     - **User** → **User Details** → **Read** ✅
   - Account Resources: Include → Your Account
   - TTL: 选择合适的有效期
4. 复制新Token
5. 更新 `.env.local`:
   ```
   CLOUDFLARE_API_TOKEN=你的新Token
   ```
6. 再次运行: `.\init-database.ps1`

### 方法 B: 使用 wrangler login

```powershell
# 1. 确保没有设置API Token环境变量
$env:CLOUDFLARE_API_TOKEN = $null

# 2. 登录
npx wrangler login

# 3. 执行初始化
npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote

# 4. 验证
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

---

## 📝 完成后的检查清单

- [ ] 所有7个表都已创建
- [ ] 所有索引都已创建
- [ ] 运行 `npm run dev` 启动开发服务器
- [ ] 访问 http://localhost:3000
- [ ] 首页统计数据正常显示
- [ ] 点赞功能正常工作
- [ ] 浏览器控制台无错误

---

## 🆘 需要帮助？

如果遇到问题，请提供:
1. 截图或复制的错误信息
2. 执行了哪些步骤
3. 当前看到了哪些表（执行 `SELECT name FROM sqlite_master WHERE type='table'` 的结果）

---

## ✨ 完成！

数据库初始化完成后，所有API接口将正常工作：
- ✅ `/api/stats` - 网站统计
- ✅ `/api/stats/like` - 点赞
- ✅ `/api/posts` - 文章
- ✅ `/api/bookmarks` - 书签
- ✅ `/api/journey` - 旅程
- ✅ `/api/view-counts` - 浏览统计
