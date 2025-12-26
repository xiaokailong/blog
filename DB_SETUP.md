# 数据库设置指南

## 快速初始化

### 本地开发环境

```powershell
# 初始化本地数据库
npx wrangler d1 execute blog-db --file=./db/complete-init.sql --local

# 或者只初始化首页数据
npx wrangler d1 execute blog-db --file=./db/homepage-redesign.sql --local
```

### 生产环境

```powershell
# 设置环境变量（避免SSL错误）
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'

# 初始化远程数据库
npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote

# 或者只初始化首页数据
npx wrangler d1 execute blog-db --file=./db/homepage-redesign.sql --remote
```

## 数据库检查

### 查看所有表

```powershell
# 本地
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table'" --local

# 远程
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table'" --remote
```

### 查看首页统计数据

```powershell
# 本地
npx wrangler d1 execute blog-db --command="SELECT * FROM homepage WHERE id = 1" --local

# 远程
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npx wrangler d1 execute blog-db --command="SELECT * FROM homepage WHERE id = 1" --remote
```

## 常用脚本

### 检查数据库状态

```powershell
.\check-database.bat
```

### 测试API接口

```powershell
.\test-apis.bat
```

## 数据库文件说明

- **complete-init.sql** - 完整数据库初始化（包含所有表和种子数据）
- **homepage-redesign.sql** - 首页数据表初始化
- **schema.sql** - 数据库表结构定义
- **seed.sql** - 种子数据
- **journey-onur-dev.sql** - Journey时间轴数据
- **clean.sql** - 清空所有表数据（慎用！）

## 表结构概览

1. **homepage** - 首页统计（访问量、点赞数、运行天数）
2. **posts** - 文章内容
3. **view_counts** - 文章浏览统计
4. **bookmarks** - 书签数据
5. **bookmark_collections** - 书签分类
6. **journey_items** - 旅程时间线
7. **page_views** - 页面访问记录
8. **site_likes** - 网站点赞（已弃用，改用homepage表）

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
