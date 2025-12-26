# 数据库设置指南

## 重要说明

⚠️ **本项目不使用本地数据库** - 开发环境和生产环境都直接使用 Cloudflare D1 生产数据库。

## API配置

所有环境（开发和生产）都使用生产API：
- **API Base URL**: `https://velen-blog.pages.dev/api`
- 前端组件通过 `@/lib/config` 中的 `getApiUrl()` 函数统一调用生产API
- API路由已配置CORS，支持跨域访问

## 快速初始化

### 生产环境数据库

```powershell
# 设置环境变量（避免SSL错误）
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'

# 初始化数据库
npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote

# 或者只初始化首页数据
npx wrangler d1 execute blog-db --file=./db/homepage-redesign.sql --remote
```

## 环境变量配置

确保 `.env.local` 文件包含以下配置：

```bash
# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token  # 可选，wrangler login后不需要
```

详细配置说明请参考 [DATABASE_CONNECTION.md](docs/DATABASE_CONNECTION.md)

## 故障排除

### 错误：no such table

执行初始化脚本创建缺失的表。

### 错误：Authentication error

1. 检查API Token权限
2. 或者使用 `npx wrangler login` 进行OAuth登录

### 本地开发环境无法访问数据库

确保已执行本地数据库初始化命令。
 - 生产环境配置
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token  # API路由需要此token访问数据库
```

**注意**：开发环境和生产环境共用同一个数据库，前端直接调用生产API。