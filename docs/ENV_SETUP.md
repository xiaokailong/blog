# 🔧 Cloudflare 凭据配置指南

## 问题说明

构建和本地运行需要配置 Cloudflare 凭据才能访问 D1 数据库。

## 快速解决方案

### 1. 获取 Cloudflare Account ID

```bash
# 方法1: 从 Cloudflare Dashboard 获取
# 1. 访问 https://dash.cloudflare.com/
# 2. 点击右上角头像 > Account Home
# 3. 在页面右侧找到 Account ID 并复制

# 方法2: 从 wrangler 命令获取
npx wrangler whoami
# 输出示例:
# Account ID: abc123def456
```

### 2. 获取 Cloudflare API Token

```bash
# 从 Cloudflare Dashboard 创建 API Token
# 1. 访问 https://dash.cloudflare.com/profile/api-tokens
# 2. 点击 "Create Token"
# 3. 选择模板 "Edit Cloudflare Workers" 或自定义权限：
#    - Account > D1 > Edit
#    - Account > Worker Scripts > Edit
# 4. 创建后复制 Token（只显示一次，请妥善保存！）
```

### 3. 配置 .env.local

将获取的凭据填入 `.env.local` 文件：

```dotenv
# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID=你的账户ID（从上面获取）
CLOUDFLARE_API_TOKEN=你的API令牌（从上面获取）
CLOUDFLARE_D1_DATABASE_ID=3dd242d5-f86b-4acb-83e8-04945a47a525

# Database initialization secret (optional, for /api/db-init)
DATABASE_INIT_SECRET=your_random_secret_here

# Contentful Preview (optional)
CONTENTFUL_PREVIEW_SECRET=
NEXT_REVALIDATE_SECRET=
```

### 4. 验证配置

```bash
# 测试数据库连接
npm run db:query "SELECT COUNT(*) as count FROM posts"

# 如果成功，会显示类似：
# ┌───────┐
# │ count │
# ├───────┤
# │ 2     │
# └───────┘
```

## 常见问题

### Q: 我的 wrangler 已登录，为什么还需要配置？

A: `wrangler login` 使用 OAuth 认证，但 Next.js 应用在运行时需要 API Token 来访问 D1 REST API。

### Q: 构建失败显示 "your_account_id"

A: 这表示你还没有更新 `.env.local` 文件中的占位符。请按照上述步骤获取真实凭据。

### Q: 如何只在 Cloudflare 部署时使用 D1，本地开发不需要？

A: 目前的实现需要在本地开发时通过 REST API 访问 D1。如果你不想在本地使用真实数据：

1. 可以考虑使用 `wrangler dev` 命令启动 Workers 开发服务器
2. 或者修改代码在本地使用 SQLite 模拟

### Q: API Token 的权限最小需要哪些？

A: 最小权限：
- **D1**: Read + Edit
- **Workers Scripts**: Read（如果需要部署）

## Cloudflare Pages 部署配置

在 Cloudflare Pages 部署时，D1 会自动绑定，无需手动配置环境变量。

1. 访问 Cloudflare Pages 项目设置
2. 进入 **Settings** > **Functions** > **D1 database bindings**
3. 添加绑定：
   - **Variable name**: `DB`
   - **D1 database**: `blog-db`
4. 重新部署即可

## 下一步

配置完成后，运行：

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器（需要先 build）
npm run start:prod
```

## 需要帮助？

查看详细文档：
- [docs/QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [docs/CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) - Cloudflare 完整配置
- [docs/README.md](./README.md) - 数据库详细说明
