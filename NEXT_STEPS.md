# ⚠️ 需要配置 Cloudflare 凭据

## 📝 你需要做什么

### 步骤 1: 获取 Cloudflare Account ID

1. 访问 https://dash.cloudflare.com/
2. 点击右上角头像 > **Account Home**
3. 在页面右侧找到 **Account ID** 并复制

### 步骤 2: 创建 API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **"Create Token"**
3. 选择 **"Edit Cloudflare Workers"** 模板，或自定义权限：
   - Account > D1 > Edit ✅
   - Account > Worker Scripts > Edit ✅
4. 点击 **"Continue to summary"** > **"Create Token"**
5. **⚠️ 复制 Token（只显示一次！）**

### 步骤 3: 更新 .env.local

打开项目根目录的 `.env.local` 文件，替换占位符：

```dotenv
# 替换这两行：
CLOUDFLARE_ACCOUNT_ID=你刚才复制的Account_ID
CLOUDFLARE_API_TOKEN=你刚才创建的API_Token

# 其他行保持不变
CLOUDFLARE_D1_DATABASE_ID=3dd242d5-f86b-4acb-83e8-04945a47a525
```

### 步骤 4: 测试连接

```bash
# 测试数据库连接
npm run db:query "SELECT COUNT(*) as count FROM posts"

# 如果成功，会显示：
# ┌───────┐
# │ count │
# ├───────┤
# │ 2     │
# └───────┘
```

### 步骤 5: 构建并运行

```bash
# 构建项目
npm run build

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 🚀 部署到 Cloudflare Pages

### 步骤 1: 提交代码

```bash
git add .
git commit -m "Fix deployment issues and add D1 database"
git push
```

### 步骤 2: 配置 D1 绑定（在 Cloudflare Dashboard）

1. 访问你的 Cloudflare Pages 项目
2. 进入 **Settings** > **Functions**
3. 滚动到 **D1 database bindings**
4. 点击 **Add binding**:
   - Variable name: `DB`
   - D1 database: `blog-db`
5. 点击 **Save**

### 步骤 3: 重新部署

推送代码后会自动触发部署，或在 Dashboard 手动触发重新部署。

---

## 📚 详细文档

如需更多帮助，查看：

- [docs/ENV_SETUP.md](docs/ENV_SETUP.md) - 完整环境配置指南
- [docs/DEPLOYMENT_FIX.md](docs/DEPLOYMENT_FIX.md) - 本次修复的详细说明
- [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md) - Cloudflare 完整配置

---

## ✅ 修复完成的问题

1. ✅ Cloudflare Pages 部署配置（wrangler.toml）
2. ✅ Package.json 启动脚本
3. ✅ 所有 TypeScript 类型错误
4. ✅ 客户端/服务端组件问题
5. ✅ 数据库连接错误处理
6. ✅ Bookmarks 数据结构兼容
7. ✅ 构建时预渲染问题

**现在只需要你配置凭据即可正常运行！** 🎉
