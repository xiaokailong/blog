# 数据库初始化 - 快速指南

## 🎯 快速开始（3步完成）

### 步骤 1: 登录 Cloudflare

1. 打开命令行，执行：
```bash
wrangler login
```

2. 浏览器会打开，点击"允许"授权

### 步骤 2: 创建表结构

在项目根目录执行：

```bash
wrangler d1 execute blog-db --remote --file=./db/schema.sql
```

### 步骤 3: 插入测试数据

```bash
wrangler d1 execute blog-db --remote --file=./db/seed.sql
```

## ✅ 验证

查看是否成功：

```bash
# 查看文章数量
wrangler d1 execute blog-db --remote --command="SELECT COUNT(*) FROM posts"

# 查看书签集合
wrangler d1 execute blog-db --remote --command="SELECT name, slug FROM bookmark_collections"

# 查看所有表
wrangler d1 execute blog-db --remote --command="SELECT name FROM sqlite_master WHERE type='table'"
```

如果看到数据返回，说明初始化成功！

## 🌐 使用 Web 界面初始化（备选方案）

如果命令行遇到问题，可以使用 Cloudflare Dashboard：

1. 访问: https://dash.cloudflare.com/
2. 点击 **Workers & Pages** > **D1 Databases**
3. 找到 `blog-db` 数据库
4. 点击 **Console** 标签
5. 复制 `db/schema.sql` 文件的全部内容，粘贴到控制台，点击"Execute"
6. 复制 `db/seed.sql` 文件的全部内容，粘贴到控制台，点击"Execute"

## 📝 下一步

数据库初始化完成后，你需要：

1. 提供真实的文章数据（替换测试数据）
2. 部署到 Cloudflare Pages
3. 在 Pages 项目中绑定 D1 数据库（变量名：`DB`）

详细说明请查看 [README.md](./README.md)
