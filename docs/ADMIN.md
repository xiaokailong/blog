# 后台管理说明

## 📊 当前状态

**重要提示**: 本项目目前 **没有传统意义的后台管理界面**。

## 🔍 已有的管理功能

### 1. Draft Mode（草稿预览模式）

项目包含两个与内容预览相关的API端点：

#### 启用草稿模式
- **路径**: `/api/draft`
- **方法**: GET
- **参数**: 
  - `secret`: 预览密钥（需要设置环境变量）
  - `slug`: 要预览的文章slug（可选）

**使用方式**:
```
https://yourdomain.com/api/draft?secret=YOUR_SECRET&slug=article-slug
```

#### 禁用草稿模式
- **路径**: `/api/disable-draft`
- **方法**: GET
- **参数**: 
  - `secret`: 预览密钥

**使用方式**:
```
https://yourdomain.com/api/disable-draft?secret=YOUR_SECRET
```

### 2. 内容Revalidation（重新验证缓存）

- **路径**: `/api/revalidate`
- **方法**: POST
- **用途**: 重新验证Next.js的静态缓存

## 💡 管理内容的方式

### 方法1: 直接操作数据库（推荐）

使用 Wrangler CLI 或 Cloudflare Dashboard:

```bash
# 添加新文章
wrangler d1 execute blog-db --remote --command="
INSERT INTO posts (title, slug, content, excerpt, date, first_published_at, published_at, tags)
VALUES ('标题', 'slug', '{}', '摘要', '2024-12-22', '2024-12-22T00:00:00Z', '2024-12-22T00:00:00Z', '[]')
"

# 更新文章
wrangler d1 execute blog-db --remote --command="
UPDATE posts SET title = '新标题', updated_at = datetime('now') WHERE slug = 'article-slug'
"

# 删除文章
wrangler d1 execute blog-db --remote --command="
DELETE FROM posts WHERE slug = 'article-slug'
"

# 查看所有文章
wrangler d1 execute blog-db --remote --command="
SELECT id, title, slug, date, is_draft FROM posts ORDER BY date DESC
"
```

### 方法2: 使用 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** > **D1 Databases**
3. 点击 `blog-db` 数据库
4. 点击 **Console** 标签
5. 直接执行 SQL 语句

### 方法3: 编写管理脚本

你可以创建Node.js脚本来批量管理内容：

```javascript
// scripts/add-post.js
import { createPost } from '../src/lib/db'

await createPost({
  title: '我的新文章',
  slug: 'my-new-post',
  content: { /* 富文本JSON */ },
  excerpt: '文章摘要',
  date: '2024-12-22',
  tags: ['技术', '教程'],
  is_draft: false
})
```

## 🎨 构建后台管理界面（可选）

如果你需要一个完整的后台管理界面，可以考虑以下方案：

### 方案A: 添加管理页面到当前项目

在 `src/app/admin` 创建管理页面：

```
src/app/admin/
  ├── page.tsx          # 管理首页
  ├── posts/
  │   ├── page.tsx      # 文章列表
  │   ├── new/
  │   │   └── page.tsx  # 新建文章
  │   └── [slug]/
  │       └── page.tsx  # 编辑文章
  └── bookmarks/
      └── page.tsx      # 书签管理
```

**注意**: 需要添加身份验证（如 Clerk、Auth.js）来保护管理页面。

### 方案B: 使用第三方管理工具

可以集成以下工具：

1. **Cloudflare D1 Studio** - Cloudflare 官方数据库管理工具
2. **TablePlus** / **DBeaver** - 通过 Cloudflare API 连接
3. **Retool** - 快速构建内部管理工具
4. **Forest Admin** - 自动生成管理界面

### 方案C: 静态内容管理（推荐轻量级博客）

如果博客更新不频繁，可以：

1. 准备Markdown文件
2. 编写转换脚本将Markdown转为数据库记录
3. 通过Git管理内容（类似 Obsidian + Git）

## 🔐 安全建议

如果你要构建管理界面：

1. ✅ **必须添加身份验证** - 不要公开暴露管理页面
2. ✅ **使用环境变量** - 保护敏感密钥
3. ✅ **限制API访问** - 添加rate limiting
4. ✅ **日志记录** - 记录所有管理操作
5. ✅ **定期备份** - 自动备份D1数据库

## 📝 推荐工作流

### 日常写作流程

1. 在本地编写文章（Markdown或富文本编辑器）
2. 转换为JSON格式
3. 使用 Wrangler CLI 插入数据库
4. 访问 `/api/revalidate` 清除缓存
5. 预览效果

### 批量管理

创建管理脚本 `scripts/manage.js`:

```javascript
import { program } from 'commander'

program
  .command('add-post')
  .description('添加新文章')
  .action(async () => {
    // 添加文章逻辑
  })

program
  .command('list-posts')
  .description('列出所有文章')
  .action(async () => {
    // 列出文章逻辑
  })

program.parse()
```

使用：
```bash
node scripts/manage.js add-post
node scripts/manage.js list-posts
```

## 🚀 未来扩展

如果需要完整的CMS功能，可以考虑：

1. 集成 **Tina CMS** 或 **Sanity.io** (Git-based CMS)
2. 构建自定义管理界面（使用 React + Next.js API Routes）
3. 使用 **Payload CMS** 作为独立后台

## ❓ 常见问题

**Q: 如何快速添加文章？**  
A: 推荐使用 Cloudflare Dashboard 的 Console，直接执行 INSERT 语句。

**Q: 可以批量导入文章吗？**  
A: 可以，准备好 SQL 文件后使用 `wrangler d1 execute --file=import.sql`。

**Q: 如何设置文章为草稿？**  
A: 在插入时设置 `is_draft = 1`，或更新现有文章的 `is_draft` 字段。

**Q: 需要登录才能管理内容吗？**  
A: 目前没有登录系统，所有管理通过 Cloudflare 账户完成。如需Web界面，需自行添加认证。

---

## 📞 需要帮助？

如果你需要构建自定义管理界面，请告诉我具体需求，我可以帮你：
- 创建管理页面组件
- 添加身份验证
- 编写管理API路由
- 设计内容编辑器
