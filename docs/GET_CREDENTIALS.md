# 🔐 获取Cloudflare凭证指南

## 需要的信息

1. **Account ID** - 你的Cloudflare账户ID
2. **API Token** - 具有D1数据库编辑权限的token

---

## 📍 步骤1: 获取Account ID

### 方法1: 从Dashboard获取

1. 访问 https://dash.cloudflare.com/
2. 登录你的账户
3. 在右侧边栏可以看到 **Account ID**
4. 复制这个ID

### 方法2: 从URL获取

访问任意Cloudflare页面，URL中会包含Account ID：
```
https://dash.cloudflare.com/{account_id}/...
```

---

## 🔑 步骤2: 创建API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens

2. 点击 **Create Token** 按钮

3. 选择 **Create Custom Token**

4. 配置Token:
   - **Token name**: `D1 Database Access` (或任意名称)
   - **Permissions**:
     - Account → **D1** → **Edit** ✅
   - **Account Resources**:
     - Include → **Specific account** → 选择你的账户
   - **TTL**: Start Date = 现在, End Date = 不设置（永久有效）

5. 点击 **Continue to summary**

6. 点击 **Create Token**

7. **重要**: 复制并保存Token（只会显示一次！）

---

## ✅ 验证凭证

使用PowerShell测试（在项目根目录执行）:

```powershell
# 替换为你的实际值
$AccountId = "你的Account_ID"
$ApiToken = "你的API_Token"

# 测试连接
.\db\init-d1-api.ps1 -AccountId $AccountId -ApiToken $ApiToken -Action status
```

如果成功，会显示数据库表列表。

---

## 📝 保存到.env.local

创建或更新 `.env.local` 文件：

```bash
# Cloudflare D1 配置
CLOUDFLARE_ACCOUNT_ID=你的Account_ID
CLOUDFLARE_API_TOKEN=你的API_Token
CLOUDFLARE_D1_DATABASE_ID=3dd242d5-f86b-4acb-83e8-04945a47a525

# 数据库初始化密钥
DATABASE_INIT_SECRET=mysecret123

# 其他密钥
CONTENTFUL_PREVIEW_SECRET=preview_secret
NEXT_REVALIDATE_SECRET=revalidate_secret
```

保存后可以直接运行：

```powershell
.\db\init-d1-api.ps1 -Action all
```

脚本会自动从 `.env.local` 读取配置。

---

## 🎯 准备好了吗？

请提供以下信息：

1. **Account ID**: `__________________________`
2. **API Token**: `__________________________`

我会帮你初始化数据库！

---

## ⚠️ 安全提示

- **不要将API Token提交到Git仓库**
- `.env.local` 已在 `.gitignore` 中
- 如果Token泄露，立即在Dashboard中删除并重新创建
- 生产环境使用Cloudflare Pages的环境变量，不要硬编码
