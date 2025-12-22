# Cloudflare D1 数据库初始化脚本（使用REST API）
# 适用于无法使用wrangler CLI的情况

param(
    [string]$AccountId = "",
    [string]$ApiToken = "",
    [string]$DatabaseId = "3dd242d5-f86b-4acb-83e8-04945a47a525",
    [string]$Action = "init"
)

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Cloudflare D1 数据库初始化工具" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 从环境变量或.env文件读取配置
if ([string]::IsNullOrEmpty($AccountId)) {
    if (Test-Path ".env.local") {
        Write-Host "从 .env.local 读取配置..." -ForegroundColor Yellow
        $envContent = Get-Content ".env.local"
        foreach ($line in $envContent) {
            if ($line -match "CLOUDFLARE_ACCOUNT_ID=(.+)") {
                $AccountId = $matches[1].Trim()
            }
            if ($line -match "CLOUDFLARE_API_TOKEN=(.+)") {
                $ApiToken = $matches[1].Trim()
            }
        }
    }
}

# 验证必需参数
if ([string]::IsNullOrEmpty($AccountId) -or [string]::IsNullOrEmpty($ApiToken)) {
    Write-Host "错误: 缺少必需的参数" -ForegroundColor Red
    Write-Host ""
    Write-Host "使用方法:" -ForegroundColor Yellow
    Write-Host "  .\db\init-d1-api.ps1 -AccountId YOUR_ACCOUNT_ID -ApiToken YOUR_API_TOKEN" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "或者创建 .env.local 文件包含:" -ForegroundColor Yellow
    Write-Host "  CLOUDFLARE_ACCOUNT_ID=your_account_id" -ForegroundColor Gray
    Write-Host "  CLOUDFLARE_API_TOKEN=your_api_token" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "配置信息:" -ForegroundColor Green
Write-Host "  Account ID: $($AccountId.Substring(0, 8))..." -ForegroundColor Gray
Write-Host "  Database ID: $DatabaseId" -ForegroundColor Gray
Write-Host "  API Token: ****" -ForegroundColor Gray
Write-Host ""

$apiUrl = "https://api.cloudflare.com/client/v4/accounts/$AccountId/d1/database/$DatabaseId/query"

function Invoke-D1Query {
    param([string]$Sql)
    
    $body = @{
        sql = $Sql
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post `
            -Headers @{
                "Authorization" = "Bearer $ApiToken"
                "Content-Type" = "application/json"
            } `
            -Body $body
        
        return $response
    } catch {
        Write-Host "API 请求失败: $_" -ForegroundColor Red
        Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
        throw
    }
}

try {
    if ($Action -eq "init" -or $Action -eq "all") {
        Write-Host "[1/3] 创建数据库表..." -ForegroundColor Yellow
        
        # 读取schema.sql文件
        $schemaPath = ".\db\schema.sql"
        if (Test-Path $schemaPath) {
            $schema = Get-Content $schemaPath -Raw
            
            # 分割SQL语句（以分号分隔）
            $statements = $schema -split ";" | Where-Object { $_.Trim() -ne "" }
            
            $count = 0
            foreach ($stmt in $statements) {
                $cleanStmt = $stmt.Trim()
                if ($cleanStmt) {
                    Write-Host "  执行: $($cleanStmt.Substring(0, [Math]::Min(50, $cleanStmt.Length)))..." -ForegroundColor Gray
                    Invoke-D1Query -Sql $cleanStmt | Out-Null
                    $count++
                }
            }
            
            Write-Host "  ✓ 成功执行 $count 条SQL语句" -ForegroundColor Green
        } else {
            Write-Host "  错误: 找不到 schema.sql 文件" -ForegroundColor Red
            exit 1
        }
    }

    if ($Action -eq "seed" -or $Action -eq "all") {
        Write-Host ""
        Write-Host "[2/3] 插入测试数据..." -ForegroundColor Yellow
        
        # 插入测试文章
        $insertPost = @"
INSERT OR IGNORE INTO posts (title, slug, content, excerpt, date, first_published_at, published_at, is_draft, tags)
VALUES ('Welcome to My Blog', 'welcome-to-my-blog', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"欢迎来到我的博客！"}]}]}', '欢迎来到我的博客！', '2024-01-15', '2024-01-15T08:00:00.000Z', '2024-01-15T08:00:00.000Z', 0, '["博客"]')
"@
        
        Invoke-D1Query -Sql $insertPost | Out-Null
        Write-Host "  ✓ 插入测试文章" -ForegroundColor Green
        
        # 插入书签集合
        $collections = @(
            @('前端开发', 'frontend', '前端开发相关的优质资源', '🎨', '#3B82F6'),
            @('后端技术', 'backend', '后端开发和架构相关资源', '⚙️', '#10B981'),
            @('设计工具', 'design', '设计和UI/UX相关工具', '✨', '#F59E0B'),
            @('学习资源', 'learning', '编程学习和教程资源', '📚', '#8B5CF6')
        )
        
        foreach ($col in $collections) {
            $sql = "INSERT OR IGNORE INTO bookmark_collections (name, slug, description, icon, color, count) VALUES ('$($col[0])', '$($col[1])', '$($col[2])', '$($col[3])', '$($col[4])', 0)"
            Invoke-D1Query -Sql $sql | Out-Null
        }
        
        Write-Host "  ✓ 插入 $($collections.Count) 个书签集合" -ForegroundColor Green
    }

    if ($Action -eq "status" -or $Action -eq "all") {
        Write-Host ""
        Write-Host "[3/3] 验证数据库..." -ForegroundColor Yellow
        
        # 查询表列表
        $tables = Invoke-D1Query -Sql "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        Write-Host "  数据库表:" -ForegroundColor Cyan
        foreach ($table in $tables.result[0].results) {
            Write-Host "    - $($table.name)" -ForegroundColor Gray
        }
        
        # 查询文章数量
        $postCount = Invoke-D1Query -Sql "SELECT COUNT(*) as count FROM posts"
        Write-Host "  文章数量: $($postCount.result[0].results[0].count)" -ForegroundColor Cyan
        
        # 查询书签集合数量
        $collectionCount = Invoke-D1Query -Sql "SELECT COUNT(*) as count FROM bookmark_collections"
        Write-Host "  书签集合: $($collectionCount.result[0].results[0].count)" -ForegroundColor Cyan
    }

    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "✓ 数据库初始化成功！" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Red
    Write-Host "✗ 初始化失败" -ForegroundColor Red
    Write-Host "==================================" -ForegroundColor Red
    Write-Host "错误信息: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "请检查:" -ForegroundColor Yellow
    Write-Host "  1. Account ID 是否正确" -ForegroundColor Gray
    Write-Host "  2. API Token 是否有 D1:Edit 权限" -ForegroundColor Gray
    Write-Host "  3. Database ID 是否正确" -ForegroundColor Gray
    Write-Host "  4. 网络连接是否正常" -ForegroundColor Gray
    exit 1
}
