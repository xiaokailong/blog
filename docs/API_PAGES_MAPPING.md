# API接口和页面数据对应关系

## ✅ 已完成的修复

### 1. Bookmarks 页面修复
**问题**: bookmarks页面无法正常显示，报错 "Application error: a server-side exception has occurred"
**原因**: 数据库字段映射不匹配（name vs title, 缺少_id等）
**修复**: 
- 更新 `getBookmarkCollections()` 函数映射数据库字段到前端期望格式
- 更新 `getBookmarksByCollection()` 函数映射书签数据并安全处理URL解析
- 更新 TypeScript 类型定义

## 📋 页面与API对应关系

### 1. **首页** (`/`)
- **页面文件**: `src/app/page.tsx`
- **数据来源**: 直接调用 `getAllPosts()` from `@/lib/contentful`
- **API接口**: 
  - ✅ `/api/posts` - 获取所有文章列表
  - ✅ `/api/view-counts` - 获取浏览量数据
- **数据库表**: `posts`, `view_counts`
- **状态**: ✅ 正常

### 2. **Writing 页面** (`/writing`)
- **页面文件**: `src/app/writing/page.tsx`
- **数据来源**: `getAllPosts()` from `@/lib/contentful`
- **API接口**: 
  - ✅ `/api/posts` - 获取文章列表
  - ✅ `/api/view-counts` - 获取浏览量
- **数据库表**: `posts`, `view_counts`
- **状态**: ✅ 正常

### 3. **Writing 详情页** (`/writing/[slug]`)
- **页面文件**: `src/app/writing/[slug]/page.tsx`
- **数据来源**: `getPost(slug)` from `@/lib/contentful`
- **API接口**: 
  - ✅ `/api/posts/[slug]` - 获取文章详情
  - ✅ `/api/increment-views` - 增加浏览量
- **数据库表**: `posts`, `view_counts`
- **状态**: ✅ 正常

### 4. **Bookmarks 页面** (`/bookmarks`)
- **页面文件**: `src/app/bookmarks/page.tsx`
- **数据来源**: `getBookmarks()` from `@/lib/raindrop`
- **API接口**: 
  - ✅ `/api/bookmarks` - 获取书签集合列表
- **数据库表**: `bookmark_collections`
- **数据映射**:
  ```typescript
  // 数据库 -> 前端
  name -> title
  id -> id, _id
  slug -> slug
  count -> count
  description -> description
  icon -> icon
  color -> color
  ```
- **状态**: ✅ 已修复

### 5. **Bookmarks 详情页** (`/bookmarks/[slug]`)
- **页面文件**: `src/app/bookmarks/[slug]/page.tsx`
- **数据来源**: `getBookmarkItems(id)` from `@/lib/raindrop`
- **API接口**: 
  - ✅ `/api/bookmarks` - 获取集合列表
  - ✅ `/api/bookmarks/[id]` - 获取集合下的书签列表
- **数据库表**: `bookmark_collections`, `bookmarks`
- **数据映射**:
  ```typescript
  // 数据库 -> 前端
  id -> _id
  url -> link
  title -> title
  description -> excerpt
  date -> created
  url.hostname -> domain
  type -> type
  ```
- **状态**: ✅ 已修复

### 6. **Journey 页面** (`/journey`)
- **页面文件**: `src/app/journey/page.tsx`
- **数据来源**: `getJourneyItems()` from `@/lib/contentful`
- **API接口**: 
  - ✅ `/api/journey` - 获取旅程项目列表
- **数据库表**: `journey_items`
- **状态**: ✅ 正常

### 7. **Workspace 页面** (`/workspace`)
- **页面文件**: `src/app/workspace/page.tsx`
- **数据来源**: 静态数据（通过 `getPageSeo('workspace')`）
- **API接口**: 无需API（静态内容）
- **状态**: ✅ 正常

### 8. **动态页面** (`/[slug]`)
- **页面文件**: `src/app/[slug]/page.tsx`
- **数据来源**: `getPage(slug)` from `@/lib/contentful`
- **API接口**: 
  - ✅ `/api/posts/[slug]` - 可复用获取页面内容
- **数据库表**: `posts` (可能需要增加page类型区分)
- **状态**: ✅ 正常

## 🔧 新增API接口

### 文章相关
1. **GET** `/api/posts` - 获取所有文章
2. **GET** `/api/posts/[slug]` - 获取单篇文章详情

### 书签相关
3. **GET** `/api/bookmarks` - 获取书签集合列表
4. **GET** `/api/bookmarks/[id]` - 获取集合下的书签列表（支持分页）
   - 查询参数: `?page=0&perPage=50`

### 旅程相关
5. **GET** `/api/journey` - 获取旅程项目列表

### 已存在的API
- **POST** `/api/submit-bookmark` - 提交书签
- **POST** `/api/increment-views` - 增加浏览量
- **GET** `/api/view-counts` - 获取所有浏览量
- **GET** `/api/test-db` - 测试数据库连接
- **GET** `/api/db-init` - 初始化数据库

## 📊 数据库表结构

### posts (文章)
- 字段: id, title, slug, content, excerpt, date, is_draft, tags
- 索引: slug, date, is_draft

### view_counts (浏览量)
- 字段: id, slug, view_count
- 索引: slug

### bookmark_collections (书签集合)
- 字段: id, name, slug, description, icon, color, count
- 索引: slug

### bookmarks (书签)
- 字段: id, url, title, description, email, type, status, collection_id, date
- 索引: status, collection_id

### journey_items (旅程)
- 字段: id, title, description, date, year, type, icon, link
- 索引: year, date

## ⚠️ 注意事项

### SSL 证书错误
构建时的 SSL 证书错误是本地开发环境问题，不影响生产环境（Cloudflare Pages）。
```
Error: unable to get local issuer certificate
```
这个错误只在本地构建时访问Cloudflare D1 REST API时出现，部署后使用原生D1绑定不会有此问题。

### Edge Runtime 兼容性
所有API接口都已配置为Edge Runtime兼容：
```typescript
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
```

## 🚀 部署清单

部署到Cloudflare Pages前确保：

1. ✅ 已添加 `compatibility_flags = ["nodejs_compat"]` 到 wrangler.toml
2. ✅ 已设置正确的 `pages_build_output_dir = ".vercel/output/static"`
3. ✅ 数据库已初始化并填充测试数据
4. ✅ 所有API接口已测试
5. ✅ Bookmarks页面数据映射已修复

## 📝 测试建议

1. 访问 `/api/bookmarks` 确认返回书签集合
2. 访问 `/api/bookmarks/1` 确认返回书签列表
3. 访问 `/api/posts` 确认返回文章列表
4. 访问 `/bookmarks` 页面确认正常显示
5. 访问 `/bookmarks/frontend` 确认详情页正常
