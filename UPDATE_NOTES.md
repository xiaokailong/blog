# 数据库更新说明

## 需要在生产数据库执行的更新

### 更新日期: 2025-12-24

### 更新内容
添加 `page_views` 表以支持页面访问统计功能。

### 执行步骤

#### 方法1: 通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages
3. 找到你的 D1 数据库 (blog-db)
4. 点击 "Console" 标签
5. 复制并执行以下 SQL:

```sql
-- 创建 page_views 表
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  page TEXT NOT NULL,
  visited_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(ip_address, page)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC);
```

6. 验证表是否创建成功:
```sql
SELECT sql FROM sqlite_master WHERE type='table' AND name='page_views';
```

#### 方法2: 通过 Wrangler CLI (如果已配置)

```bash
npx wrangler d1 execute blog-db --remote --file=./db/production-update-2025-12-24.sql
```

### 验证

执行完成后，可以运行以下查询验证:

```sql
-- 查看表结构
SELECT sql FROM sqlite_master WHERE type='table' AND name='page_views';

-- 查看所有索引
SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='page_views';
```

### 注意事项

- 这些 SQL 语句使用 `IF NOT EXISTS`，因此重复执行是安全的
- 不会影响现有数据
- 执行时间很短，不需要停机

## 本地开发环境

### Writing 详情页问题

当前开发环境 `writing` 详情页显示 "post not found" 是因为:

1. 本地数据库可能未初始化
2. 没有测试数据

### 解决方案

访问数据库初始化接口（需要配置 `DATABASE_INIT_SECRET` 环境变量）:

```
http://localhost:3000/api/db-init?secret=your_secret
```

或者手动在 Cloudflare Dashboard 中使用 `db/seed.sql` 插入测试数据。

## 新功能

### 前端面试题页面

已创建新的面试题页面:
- 路由: `/interview`
- 导航位置: Home 下方
- 布局: 左侧内容，右侧目录
- 支持移动端自适应

初始包含以下面试题:
- JavaScript 闭包
- 原型和原型链
- React Hooks
- CSS Flexbox
- HTTP 状态码
- 事件循环

可以通过编辑 `src/components/interview/interview-page-client.tsx` 添加更多面试题。

## 首页更新

在首页添加了:
1. Interview 快速链接
2. Tech Stack 技能标签区域
3. 已确保移动端适配
