# Cloudflare D1 数据库配置和初始化指南

## 问题诊断

当前遇到的问题：
1. ✅ 数据库ID已配置: `3dd242d5-f86b-4acb-83e8-04945a47a525`
2. ✅ 账号ID已配置: `24c17bbd73ff03387abaa5960296320d`
3. ❌ API Token未正确配置（当前是占位符）

## 解决方案

### 步骤1: 创建API Token

1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 选择 "Create Custom Token"
4. 配置权限：
   - **Account** → **D1** → **Edit**
   - **Account** → **Account Settings** → **Read**
5. 选择账号：选择你的账号
6. 点击 "Continue to summary"
7. 点击 "Create Token"
8. **复制生成的Token**（这是唯一一次可以看到完整Token）

### 步骤2: 更新环境变量

在 `.env.local` 文件中，将：
```
CLOUDFLARE_API_TOKEN=your_api_token_here
```

替换为：
```
CLOUDFLARE_API_TOKEN=你复制的真实Token
```

### 步骤3: 使用OAuth登录（推荐）

如果不想使用API Token，可以使用OAuth登录：

1. 删除或注释掉 `.env.local` 中的 `CLOUDFLARE_API_TOKEN` 行
2. 运行登录命令：
   ```powershell
   $env:NODE_TLS_REJECT_UNAUTHORIZED="0"
   npx wrangler login
   ```
3. 在浏览器中完成OAuth授权

### 步骤4: 执行数据库初始化

#### 方式1: 使用批处理脚本（推荐）
```powershell
.\init-database.bat
```

#### 方式2: 手动执行
```powershell
# 设置SSL绕过
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"

# 执行完整初始化
npx wrangler d1 execute blog-db --file=./db/complete-init.sql --remote

# 验证结果
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" --remote
```

### 步骤5: 检查数据库状态

```powershell
.\check-database.bat
```

或手动检查：
```powershell
npx wrangler d1 execute blog-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
npx wrangler d1 execute blog-db --command="SELECT COUNT(*) as count FROM posts;" --remote
```

## 需要创建的表

以下7个表是必需的：
1. ✅ **posts** - 文章
2. ✅ **view_counts** - 浏览量统计
3. ✅ **bookmarks** - 书签
4. ✅ **bookmark_collections** - 书签集合
5. ✅ **journey_items** - 旅程/时间线
6. ✅ **page_views** - 页面访问记录
7. ✅ **site_likes** - 网站点赞

## 使用的API接口

- `/api/stats` - 需要 `page_views`, `site_likes`
- `/api/stats/like` - 需要 `site_likes`
- `/api/posts` - 需要 `posts`
- `/api/view-counts` - 需要 `view_counts`
- `/api/bookmarks` - 需要 `bookmarks`, `bookmark_collections`
- `/api/journey` - 需要 `journey_items`
- `/api/test-db` - 检查所有表

## 常见错误解决

### 错误: "Authentication error [code: 10000]"
- **原因**: API Token权限不足或无效
- **解决**: 重新创建API Token，确保有D1编辑权限

### 错误: "UNABLE_TO_GET_ISSUER_CERT_LOCALLY"
- **原因**: SSL证书验证失败
- **解决**: 设置 `$env:NODE_TLS_REJECT_UNAUTHORIZED="0"`

### 错误: "You are logged in with an API Token"
- **原因**: 环境变量中有旧的API Token
- **解决**: 删除或注释 `.env.local` 中的 `CLOUDFLARE_API_TOKEN`

## 验证所有接口正常

创建一个测试脚本来验证所有API：

```powershell
# 测试统计API
curl http://localhost:3000/api/stats

# 测试数据库连接
curl http://localhost:3000/api/test-db

# 测试点赞API
curl -X POST http://localhost:3000/api/stats/like
```

## 下一步

完成数据库初始化后：
1. 重启开发服务器: `npm run dev`
2. 访问首页检查统计是否正常显示
3. 测试点赞功能
4. 检查浏览器控制台是否有错误

## 需要帮助？

如果遇到问题，请提供：
1. 错误信息截图
2. wrangler日志文件内容
3. 浏览器控制台错误
