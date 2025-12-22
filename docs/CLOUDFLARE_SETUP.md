# 🚀 Cloudflare D1 快速配置指南

## 📋 获取Cloudflare凭证

### 步骤1: 获取Account ID

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在右侧查看你的 **Account ID** 或点击任意域名，在右侧栏可以看到
3. 复制Account ID

### 步骤2: 创建API Token

1. 进入 **My Profile** > **API Tokens** 
   - 直接访问: https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Create Custom Token**
4. 配置权限：
   - **Account** → **D1** → **Edit**
   - **Account** → **Workers Scripts** → **Edit** (可选)
5. 设置 **Account Resources**:
   - Include → Specific account → 选择你的账户
6. 点击 **Continue to summary**
7. 点击 **Create Token**
8. **复制并保存Token**（只会显示一次）

### 步骤3: 配置环境变量

创建 `.env.local` 文件（或更新现有的）：

```bash
# Cloudflare D1 数据库配置
CLOUDFLARE_ACCOUNT_ID=你的Account_ID
CLOUDFLARE_API_TOKEN=你的API_Token
CLOUDFLARE_D1_DATABASE_ID=3dd242d5-f86b-4acb-83e8-04945a47a525

# 数据库初始化密钥（自定义一个随机字符串）
DATABASE_INIT_SECRET=随机字符串如mysecret123

# 预览模式密钥（可选，用于草稿预览）
CONTENTFUL_PREVIEW_SECRET=another_random_secret

# 重新验证密钥（用于清除缓存）
NEXT_REVALIDATE_SECRET=revalidate_secret
```

### 步骤4: 初始化数据库

有两种方法初始化数据库：

#### 方法A: 使用API路由（推荐 - 适用于本地和生产）

1. 启动本地服务器：
```bash
npm run dev
```

2. 初始化数据库表结构：
```bash
curl -X POST http://localhost:3000/api/db-init \
  -H "Content-Type: application/json" \
  -d '{"secret":"你的DATABASE_INIT_SECRET","action":"init"}'
```

或使用浏览器/Postman访问：
```
POST http://localhost:3000/api/db-init
Body: {"secret":"mysecret123","action":"init"}
```

3. 插入测试数据：
```bash
curl -X POST http://localhost:3000/api/db-init \
  -H "Content-Type: application/json" \
  -d '{"secret":"你的DATABASE_INIT_SECRET","action":"seed"}'
```

4. 检查状态：
```bash
curl -X POST http://localhost:3000/api/db-init \
  -H "Content-Type: application/json" \
  -d '{"secret":"你的DATABASE_INIT_SECRET","action":"status"}'
```

#### 方法B: 使用Wrangler CLI（需要解决SSL证书问题）

如果网络环境允许：

```bash
# 登录
wrangler login

# 初始化数据库
wrangler d1 execute blog-db --remote --file=./db/schema.sql
wrangler d1 execute blog-db --remote --file=./db/seed.sql
```

## 🌐 生产环境部署（Cloudflare Pages）

### 步骤1: 配置环境变量

1. 进入 Cloudflare Pages 项目设置
2. 进入 **Settings** > **Environment variables**
3. 添加以下变量（**Production** 和 **Preview** 都要添加）：
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   - `DATABASE_INIT_SECRET`
   - `NEXT_REVALIDATE_SECRET`
   - `CONTENTFUL_PREVIEW_SECRET`（如需要）

### 步骤2: 绑定D1数据库

1. 进入 **Settings** > **Functions**
2. 找到 **D1 database bindings**
3. 点击 **Add binding**
4. 配置：
   - **Variable name**: `DB`
   - **D1 database**: `blog-db`
5. 保存设置

### 步骤3: 部署项目

```bash
git add .
git commit -m "Configure D1 database"
git push
```

Cloudflare Pages会自动部署。

### 步骤4: 初始化生产数据库

部署完成后，访问：

```
POST https://blog.velen.fun/api/db-init
Body: {"secret":"你的DATABASE_INIT_SECRET","action":"init"}
```

然后插入数据：
```
POST https://blog.velen.fun/api/db-init
Body: {"secret":"你的DATABASE_INIT_SECRET","action":"seed"}
```

## ✅ 验证安装

### 本地验证

```bash
# 检查数据库连接
curl http://localhost:3000/api/db-init?secret=你的DATABASE_INIT_SECRET

# 应该返回：
# {"success":true,"message":"Database is accessible","tables":[...]}
```

### 生产环境验证

```bash
curl https://blog.velen.fun/api/db-init?secret=你的DATABASE_INIT_SECRET
```

## 🔧 常见问题

### Q: 如何获取Account ID？
访问 Cloudflare Dashboard，在右侧可以看到Account ID。

### Q: API Token权限不足怎么办？
确保Token有D1的Edit权限。重新创建Token时选择 "D1:Edit"。

### Q: 本地开发无法连接数据库？
检查 `.env.local` 文件是否正确配置了 `CLOUDFLARE_ACCOUNT_ID` 和 `CLOUDFLARE_API_TOKEN`。

### Q: 生产环境报错 "Database not available"？
1. 确认Cloudflare Pages已绑定D1数据库（变量名必须是`DB`）
2. 检查环境变量是否正确设置
3. 重新部署项目

### Q: 如何查看数据库内容？
```bash
# 使用API路由
curl -X POST http://localhost:3000/api/db-init \
  -H "Content-Type: application/json" \
  -d '{"secret":"你的密钥","action":"status"}'
```

或使用 Cloudflare Dashboard:
1. 进入 D1 Databases
2. 选择 `blog-db`
3. 使用Console执行SQL查询

## 🎉 完成！

现在你的项目可以在本地和生产环境使用Cloudflare D1数据库了！

### 下一步

1. 导入真实数据（替换测试数据）
2. 测试所有API端点
3. 配置CORS（如果需要）
4. 设置定期备份

## 📞 需要帮助？

如果遇到问题，请检查：
- `.env.local` 文件配置
- Cloudflare Dashboard 中的D1绑定
- 浏览器控制台/服务器日志
