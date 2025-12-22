# Cloudflare D1 数据库迁移指南

本项目已从使用多个第三方API服务（Contentful、Supabase、Raindrop.io、Airtable、Tinybird）迁移到使用 **Cloudflare D1** 作为统一的数据存储解决方案。

## 📋 概述

### 已替换的服务

| 原服务 | 用途 | 新方案 |
|--------|------|--------|
| Contentful CMS | 博客文章内容管理 | D1 posts 表 |
| Supabase | 浏览量统计 | D1 view_counts 表 |
| Raindrop.io | 书签管理 | D1 bookmarks + bookmark_collections 表 |
| Airtable | 用户提交书签 | D1 bookmarks 表 |
| Tinybird Analytics | 网站分析 | 已移除（可选择其他方案） |

## 🗄️ 数据库结构

### 表清单
- **posts** - 博客文章
- **view_counts** - 文章浏览量
- **bookmarks** - 书签/资源
- **bookmark_collections** - 书签集合/分类
- **journey_items** - 个人时间线/旅程

详细schema请查看 [`db/schema.sql`](./schema.sql)

## 🚀 初始化数据库

### 前提条件

1. 安装 Wrangler CLI（Cloudflare 官方工具）
```bash
npm install -g wrangler
```

2. 登录 Cloudflare 账户
```bash
wrangler login
```

### 方法1: 使用命令行（推荐）

```bash
# 1. 创建表结构
wrangler d1 execute blog-db --remote --file=./db/schema.sql

# 2. 插入测试数据
wrangler d1 execute blog-db --remote --file=./db/seed.sql

# 3. 验证数据
wrangler d1 execute blog-db --remote --command="SELECT COUNT(*) as count FROM posts"
wrangler d1 execute blog-db --remote --command="SELECT name FROM bookmark_collections"
```

### 方法2: 使用 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** > **D1 Databases**
3. 找到数据库 `blog-db` (ID: `3dd242d5-f86b-4acb-83e8-04945a47a525`)
4. 点击 **Console** 标签
5. 复制 `db/schema.sql` 内容并执行
6. 复制 `db/seed.sql` 内容并执行

### 方法3: 批量查询（适合大量数据）

对于大型数据导入，建议分批执行SQL语句，每批不超过100条记录。

## 📝 测试数据说明

数据库包含2条测试文章、4个书签集合、2个测试书签和3条时间线记录。

**测试文章：**
- `welcome-to-my-blog` - 欢迎文章
- `getting-started-nextjs-cloudflare` - Next.js + Cloudflare 教程

**书签集合：**
- 前端开发 (frontend)
- 后端技术 (backend)  
- 设计工具 (design)
- 学习资源 (learning)

## 🔧 配置说明

### 环境变量

原有的外部服务环境变量已不再需要，可以从 `.env` 文件中移除：

```bash
# 以下变量已废弃，可以删除
# CONTENTFUL_SPACE_ID
# CONTENTFUL_ACCESS_TOKEN
# CONTENTFUL_PREVIEW_ACCESS_TOKEN
# SUPABASE_URL
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_RAINDROP_ACCESS_TOKEN
# AIRTABLE_PERSONAL_ACCESS_TOKEN
# AIRTABLE_BASE_ID
# AIRTABLE_BOOKMARKS_TABLE_ID
# NEXT_PUBLIC_TINYBIRD_TOKEN
```

### Wrangler 配置

数据库配置已写入 [`wrangler.toml`](../wrangler.toml)：

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "3dd242d5-f86b-4acb-83e8-04945a47a525"
```

## 🎯 API 变更

### 已修改的文件

1. **`src/lib/db.ts`** - 新建：D1数据库操作封装
2. **`src/lib/d1.ts`** - 新建：D1辅助函数
3. **`src/lib/contentful.ts`** - 替换为D1实现
4. **`src/lib/raindrop.ts`** - 替换为D1实现
5. **`src/app/api/submit-bookmark/route.ts`** - 替换Airtable为D1
6. **`src/app/api/increment-views/route.ts`** - 替换Supabase为D1
7. **`src/hooks/useViewData.tsx`** - 替换Supabase为D1
8. **`src/app/layout.tsx`** - 移除Tinybird分析代码

### 函数映射

| 原函数 | 新函数 | 位置 |
|--------|--------|------|
| Contentful `getAllPosts()` | `getAllPosts()` | `lib/db.ts` |
| Contentful `getPost()` | `getPostBySlug()` | `lib/db.ts` |
| Supabase `increment_view_count` | `incrementViewCount()` | `lib/db.ts` |
| Raindrop `getBookmarks()` | `getBookmarkCollections()` | `lib/db.ts` |
| Airtable bookmark submission | `createBookmark()` | `lib/db.ts` |

## 📦 部署到 Cloudflare Pages

### 部署步骤

1. 确保数据库已初始化（参考上面的步骤）

2. 部署到 Cloudflare Pages：
```bash
# 构建项目
npm run build

# 使用 Wrangler 部署
wrangler pages deploy .next --project-name=your-project-name
```

3. 在 Cloudflare Dashboard 中绑定 D1 数据库：
   - 进入 **Workers & Pages** > 你的项目
   - 点击 **Settings** > **Functions**
   - 在 **D1 database bindings** 添加：
     - Variable name: `DB`
     - D1 database: `blog-db`

### 本地开发

```bash
# 使用 wrangler dev 可以访问本地 D1
wrangler pages dev npm run dev

# 或者使用 --local 标志
wrangler pages dev --local npm run dev
```

## 🔄 数据迁移

### 从旧服务迁移真实数据

你需要导出旧服务的数据并转换为SQL INSERT语句：

#### 1. Contentful 文章迁移

```javascript
// 导出Contentful数据并转换为SQL
const posts = await contentful.getAllPosts()
posts.forEach(post => {
  console.log(`
    INSERT INTO posts (title, slug, content, excerpt, date, first_published_at, published_at, tags)
    VALUES (
      '${post.title}',
      '${post.slug}',
      '${JSON.stringify(post.content)}',
      '${post.excerpt}',
      '${post.date}',
      '${post.sys.firstPublishedAt}',
      '${post.sys.publishedAt}',
      '${JSON.stringify(post.tags || [])}'
    );
  `)
})
```

#### 2. Supabase 浏览量迁移

```sql
-- 导出 Supabase view_counts 表
-- 然后批量插入到 D1
INSERT INTO view_counts (slug, view_count) VALUES
('post-1', 123),
('post-2', 456);
```

#### 3. Raindrop 书签迁移

使用 Raindrop API 导出书签，然后插入到 D1。

## ⚠️ 注意事项

1. **实时更新**: D1 不支持 WebSocket/实时订阅（不同于Supabase），浏览量更新需要刷新页面
2. **查询限制**: D1 有每分钟查询次数限制，生产环境需注意
3. **数据备份**: 定期备份D1数据库
4. **内容富文本**: 文章内容以JSON格式存储，兼容原有的Contentful富文本结构

## 🐛 常见问题

### Q: 如何查看数据库中的数据？
```bash
wrangler d1 execute blog-db --remote --command="SELECT * FROM posts LIMIT 10"
```

### Q: 如何清空某个表？
```bash
wrangler d1 execute blog-db --remote --command="DELETE FROM posts"
```

### Q: 如何重置整个数据库？
```bash
# 删除所有表
wrangler d1 execute blog-db --remote --file=./db/drop-all.sql
# 重新创建
wrangler d1 execute blog-db --remote --file=./db/schema.sql
wrangler d1 execute blog-db --remote --file=./db/seed.sql
```

### Q: 本地开发时如何访问D1？
使用 `wrangler pages dev` 而不是 `next dev`，或者在开发环境使用mock数据。

## 📚 相关文档

- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

## 🎉 完成！

数据库迁移完成后，你的博客将完全独立于第三方服务，所有数据都存储在 Cloudflare D1 中。
