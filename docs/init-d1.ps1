#!/usr/bin/env powershell
# Cloudflare D1 数据库初始化脚本

Write-Host "正在初始化 Cloudflare D1 数据库..." -ForegroundColor Green

# 检查是否安装了 wrangler
if (!(Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 wrangler CLI。请先安装: npm install -g wrangler" -ForegroundColor Red
    exit 1
}

# 数据库配置
$DATABASE_ID = "3dd242d5-f86b-4acb-83e8-04945a47a525"
$DATABASE_NAME = "blog-db"

Write-Host "数据库ID: $DATABASE_ID" -ForegroundColor Cyan
Write-Host "数据库名称: $DATABASE_NAME" -ForegroundColor Cyan

# 1. 执行 schema.sql
Write-Host "`n[1/2] 创建数据库表结构..." -ForegroundColor Yellow
$schemaResult = wrangler d1 execute $DATABASE_NAME --remote --file=./db/schema.sql 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 表结构创建成功" -ForegroundColor Green
} else {
    Write-Host "✗ 表结构创建失败" -ForegroundColor Red
    Write-Host $schemaResult -ForegroundColor Red
    exit 1
}

# 2. 执行 seed.sql
Write-Host "`n[2/2] 插入测试数据..." -ForegroundColor Yellow
$seedResult = wrangler d1 execute $DATABASE_NAME --remote --file=./db/seed.sql 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 测试数据插入成功" -ForegroundColor Green
} else {
    Write-Host "✗ 测试数据插入失败" -ForegroundColor Red
    Write-Host $seedResult -ForegroundColor Red
    exit 1
}

# 3. 验证数据
Write-Host "`n验证数据库内容..." -ForegroundColor Yellow
Write-Host "查询文章数量:" -ForegroundColor Cyan
wrangler d1 execute $DATABASE_NAME --remote --command="SELECT COUNT(*) as count FROM posts"

Write-Host "`n查询书签集合:" -ForegroundColor Cyan
wrangler d1 execute $DATABASE_NAME --remote --command="SELECT name, slug FROM bookmark_collections"

Write-Host "`n✅ 数据库初始化完成！" -ForegroundColor Green
Write-Host "你现在可以开始使用 Cloudflare D1 数据库了。" -ForegroundColor Green
